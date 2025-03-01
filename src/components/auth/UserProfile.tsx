import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/integrations/supabase/client'
import { Loader2 } from 'lucide-react'

export const UserProfile = () => {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [initialUsername, setInitialUsername] = useState('')

  // Fetch the user's profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the error code for "no rows returned"
          console.error('Error fetching profile:', error);
          toast({
            title: "Error fetching profile",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          setUsername(data.username || '');
          setInitialUsername(data.username || '');
        } else {
          // Create a profile if it doesn't exist
          const defaultUsername = user.email?.split('@')[0] || '';
          setUsername(defaultUsername);
          setInitialUsername('');
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: user.id, 
              username: defaultUsername,
              created_at: new Date().toISOString()
            }]);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast({
              title: "Error creating profile",
              description: insertError.message,
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      
      if (error) throw error
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated"
      })
      
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast({
        title: "Error updating password",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }
    
    if (username === initialUsername) {
      toast({
        title: "No changes",
        description: "Username is unchanged",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update the profile
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user?.id);
        
      if (error) throw error;
      
      // Also update any discussions and reviews with the new username
      await supabase
        .from('discussions')
        .update({ author: username })
        .eq('user_id', user?.id);
        
      await supabase
        .from('reviews')
        .update({ author: username })
        .eq('user_id', user?.id);
      
      setInitialUsername(username);
      
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated"
      });
    } catch (error) {
      toast({
        title: "Error updating username",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      })
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              View and manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{username ? username.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium">{username || user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleUsernameChange} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Username
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleSignOut} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 