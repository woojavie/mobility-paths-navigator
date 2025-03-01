import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Star } from 'lucide-react';
import { DiscussionForm } from './forms/DiscussionForm';
import { ReviewForm } from './forms/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';

interface NewPostDialogProps {
  onSuccess?: () => void;
  defaultTab?: 'discussion' | 'review';
}

export function NewPostDialog({ onSuccess, defaultTab = 'discussion' }: NewPostDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          {defaultTab === 'discussion' ? (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Discussion
            </>
          ) : (
            <>
              <Star className="h-4 w-4 mr-2" />
              Write Review
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your experiences and questions with the accessibility community.
          </DialogDescription>
        </DialogHeader>
        
        {!user ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Please sign in to create a post.
            </p>
            <Button asChild>
              <a href="/signin">Sign In</a>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="discussion">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion
              </TabsTrigger>
              <TabsTrigger value="review">
                <Star className="h-4 w-4 mr-2" />
                Review
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussion">
              <DiscussionForm onSuccess={handleSuccess} />
            </TabsContent>
            
            <TabsContent value="review">
              <ReviewForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
} 