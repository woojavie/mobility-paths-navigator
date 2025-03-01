import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, User, ArrowLeft, Loader2 } from 'lucide-react';
import { ReplyForm } from './forms/ReplyForm';
import { 
  Discussion, 
  Reply, 
  fetchDiscussionById, 
  fetchReplies, 
  formatDate,
  checkIfLiked,
  addLike,
  removeLike
} from '@/services/communityService';

interface DiscussionDetailProps {
  discussionId: string;
  onBack: () => void;
}

export function DiscussionDetail({ discussionId, onBack }: DiscussionDetailProps) {
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { user } = useAuth();
  const { toast } = useToast();

  const loadDiscussion = async () => {
    try {
      setIsLoading(true);
      const discussionData = await fetchDiscussionById(discussionId);
      setDiscussion(discussionData);
      
      // Load replies
      const repliesData = await fetchReplies(discussionId, sortOrder);
      setReplies(repliesData);
      
      // Check if user has liked this discussion
      if (user) {
        const liked = await checkIfLiked(user.id, discussionId);
        setIsLiked(liked);
      }
    } catch (error) {
      console.error('Error loading discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to load the discussion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiscussion();
  }, [discussionId, sortOrder, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like discussions.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLikeLoading(true);
      
      if (isLiked) {
        await removeLike(user.id, discussionId);
        setIsLiked(false);
        setDiscussion(prev => prev ? { 
          ...prev, 
          likes_count: (prev.likes_count || 0) - 1 
        } : null);
      } else {
        await addLike(user.id, discussionId);
        setIsLiked(true);
        setDiscussion(prev => prev ? { 
          ...prev, 
          likes_count: (prev.likes_count || 0) + 1 
        } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Provide more specific error message based on the error
      let errorMessage = 'Failed to update like status. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid parameters')) {
          errorMessage = 'Invalid parameters for like operation. Please try again later.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'You have already liked this discussion.';
        } else if (error.message.includes('violates foreign key constraint')) {
          errorMessage = 'The discussion may have been deleted.';
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleReplySuccess = () => {
    loadDiscussion();
    toast({
      title: 'Reply added',
      description: 'Your reply has been added to the discussion.',
    });
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Discussion not found</h3>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Discussions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button onClick={onBack} variant="ghost" size="sm" className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Discussion</h2>
      </div>
      
      <Card className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{discussion.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{discussion.author[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{discussion.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(discussion.created_at)}</span>
            {new Date(discussion.created_at).getTime() > Date.now() - 86400000 && (
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">New</Badge>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-line">{discussion.content}</p>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center ${isLiked ? 'text-primary' : 'text-gray-500'}`}
              onClick={handleLikeToggle}
              disabled={isLikeLoading || !user}
            >
              {isLikeLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-primary' : ''}`} />
              )}
              <span>{discussion.likes_count || 0} likes</span>
            </Button>
            
            <div className="flex items-center text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{discussion.replies_count || 0} replies</span>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Replies</h3>
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={handleSortChange}>
              Sort: {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            </Button>
          </div>
        </div>
        
        {user ? (
          <Card className="p-6 mb-6">
            <h4 className="font-medium mb-3">Add your reply</h4>
            <ReplyForm discussionId={discussionId} onSuccess={handleReplySuccess} />
          </Card>
        ) : (
          <Card className="p-6 mb-6 text-center">
            <p className="text-gray-600 mb-3">Please sign in to reply to this discussion.</p>
            <Button asChild>
              <a href="/signin">Sign In</a>
            </Button>
          </Card>
        )}
        
        {replies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map(reply => (
              <Card key={reply.id} className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{reply.author[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{reply.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(reply.created_at)}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{reply.content}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 