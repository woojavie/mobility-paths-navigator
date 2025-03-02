import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageSquare, ThumbsUp, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ReplyDialog } from './ReplyDialog';
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

interface DiscussionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  discussionId: string;
  onReplySuccess?: () => void;
}

export function DiscussionDialog({ 
  isOpen, 
  onClose, 
  discussionId,
  onReplySuccess
}: DiscussionDialogProps) {
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [replyLikes, setReplyLikes] = useState<Record<string, boolean>>({});
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyDialogProps, setReplyDialogProps] = useState<{
    replyToId?: string;
    replyToAuthor?: string;
  }>({});
  const { user } = useAuth();
  const { toast } = useToast();

  console.log('DiscussionDialog props:', { isOpen, discussionId });

  const loadDiscussion = async () => {
    if (!discussionId) return;
    
    try {
      setIsLoading(true);
      console.log('Loading discussion with ID:', discussionId);
      const discussionData = await fetchDiscussionById(discussionId);
      setDiscussion(discussionData);
      
      // Load replies
      const repliesData = await fetchReplies(discussionId, sortOrder);
      setReplies(repliesData);
      
      // Check if user has liked this discussion
      if (user) {
        try {
          const liked = await checkIfLiked(user.id, discussionId);
          setIsLiked(liked);
          
          // Check if user has liked any replies
          const replyLikesStatus: Record<string, boolean> = {};
          
          // Process in batches to avoid too many parallel requests
          const batchSize = 5;
          for (let i = 0; i < repliesData.length; i += batchSize) {
            const batch = repliesData.slice(i, i + batchSize);
            const promises = batch.map(reply => 
              checkIfLiked(user.id, undefined, reply.id)
                .then(liked => {
                  replyLikesStatus[reply.id] = liked;
                })
                .catch(error => {
                  console.error(`Error checking like status for reply ${reply.id}:`, error);
                  replyLikesStatus[reply.id] = false;
                })
            );
            
            await Promise.all(promises);
          }
          
          setReplyLikes(replyLikesStatus);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
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
    if (isOpen && discussionId) {
      loadDiscussion();
    }
  }, [isOpen, discussionId, sortOrder, user]);

  const handleLikeToggle = async () => {
    if (!user || !discussion) {
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
          likes_count: Math.max(0, (prev.likes_count || 0) - 1)
        } : null);
        
        toast({
          title: 'Like removed',
          description: 'You have unliked this discussion.',
        });
      } else {
        await addLike(user.id, discussionId);
        setIsLiked(true);
        setDiscussion(prev => prev ? { 
          ...prev, 
          likes_count: (prev.likes_count || 0) + 1 
        } : null);
        
        toast({
          title: 'Like added',
          description: 'You have liked this discussion.',
        });
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
    console.log('DiscussionDialog: handleReplySuccess called');
    loadDiscussion();
    
    if (onReplySuccess) {
      onReplySuccess();
    }
    
    toast({
      title: 'Reply added',
      description: 'Your reply has been added to the discussion.',
    });
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const handleReplyLikeToggle = async (replyId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like replies.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log(`Toggling like for reply ${replyId}`);
      const isReplyLiked = replyLikes[replyId] || false;
      
      if (isReplyLiked) {
        await removeLike(user.id, undefined, replyId);
        console.log(`Removed like from reply ${replyId}`);
        setReplyLikes(prev => ({ ...prev, [replyId]: false }));
        setReplies(prev => prev.map(reply =>
          reply.id === replyId ? { ...reply, likes_count: Math.max(0, (reply.likes_count || 0) - 1) } : reply
        ));
        toast({
          title: 'Like removed',
          description: 'You have unliked this reply.',
        });
      } else {
        await addLike(user.id, undefined, replyId);
        console.log(`Added like to reply ${replyId}`);
        setReplyLikes(prev => ({ ...prev, [replyId]: true }));
        setReplies(prev => prev.map(reply =>
          reply.id === replyId ? { ...reply, likes_count: (reply.likes_count || 0) + 1 } : reply
        ));
        toast({
          title: 'Like added',
          description: 'You have liked this reply.',
        });
      }
    } catch (error) {
      console.error('Error toggling reply like:', error);
      
      let errorMessage = 'There was a problem processing your like. Please try again.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        
        if (error.message.includes('already liked')) {
          errorMessage = 'You have already liked this reply.';
        } else if (error.message.includes('not liked')) {
          errorMessage = 'You have not liked this reply.';
        } else if (error.message.includes('foreign key constraint')) {
          errorMessage = 'The reply may have been deleted.';
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleReplyToReply = (replyId: string, authorName: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to reply to comments.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Opening reply dialog for reply:', replyId, 'by author:', authorName);
    setReplyDialogProps({
      replyToId: replyId,
      replyToAuthor: authorName
    });
    setIsReplyDialogOpen(true);
  };

  const handleReplyToDiscussion = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to reply to this discussion.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Opening reply dialog for discussion:', discussionId);
    setReplyDialogProps({});
    setIsReplyDialogOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isLoading ? 'Loading Discussion...' : discussion?.title || 'Discussion'}
          </DialogTitle>
          <DialogDescription>
            View the full discussion and replies
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !discussion ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Discussion not found</h3>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4">
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
              
              {user && (
                <div className="mb-4 mt-6 border-t pt-4 border-gray-100">
                  <Button 
                    onClick={handleReplyToDiscussion}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 w-full md:w-auto"
                    size="lg"
                  >
                    <MessageSquare className="mr-3 h-6 w-6" />
                    Reply to this discussion
                  </Button>
                </div>
              )}
              
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
              
              {replies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No replies yet. Be the first to reply!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {replies
                    // Filter to only show top-level replies (those without a parent)
                    .filter(reply => !reply.parent_reply_id)
                    .map(reply => (
                      <div key={reply.id}>
                        <Card className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{reply.author[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{reply.author}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(reply.created_at)}</span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">{reply.content}</p>
                          
                          <div className="flex items-center mt-4 pt-2 border-t border-gray-100">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`flex items-center ${replyLikes[reply.id] ? 'text-primary' : 'text-gray-500'} mr-4`}
                              onClick={() => handleReplyLikeToggle(reply.id)}
                              disabled={!user}
                            >
                              <ThumbsUp className={`h-4 w-4 mr-1 ${replyLikes[reply.id] ? 'fill-primary' : ''}`} />
                              <span>{reply.likes_count || 0} likes</span>
                            </Button>
                            
                            <Button 
                              variant="default" 
                              size="default" 
                              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleReplyToReply(reply.id, reply.author)}
                              disabled={!user}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              <span>Reply to this comment</span>
                            </Button>
                          </div>
                        </Card>
                        
                        {/* Nested replies */}
                        {replies
                          .filter(nestedReply => nestedReply.parent_reply_id === reply.id)
                          .map(nestedReply => (
                            <Card key={nestedReply.id} className="p-6 mt-2 ml-8 border-l-4 border-l-gray-200">
                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{nestedReply.author[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{nestedReply.author}</span>
                                <span className="mx-2">•</span>
                                <span>{formatDate(nestedReply.created_at)}</span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-line">{nestedReply.content}</p>
                              
                              <div className="flex items-center mt-4 pt-2 border-t border-gray-100">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`flex items-center ${replyLikes[nestedReply.id] ? 'text-primary' : 'text-gray-500'} mr-4`}
                                  onClick={() => handleReplyLikeToggle(nestedReply.id)}
                                  disabled={!user}
                                >
                                  <ThumbsUp className={`h-4 w-4 mr-1 ${replyLikes[nestedReply.id] ? 'fill-primary' : ''}`} />
                                  <span>{nestedReply.likes_count || 0} likes</span>
                                </Button>
                                
                                <Button 
                                  variant="default" 
                                  size="default" 
                                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => handleReplyToReply(nestedReply.id, nestedReply.author)}
                                  disabled={!user}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  <span>Reply to this comment</span>
                                </Button>
                              </div>
                            </Card>
                          ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Reply Dialog */}
        <ReplyDialog
          isOpen={isReplyDialogOpen}
          onClose={() => setIsReplyDialogOpen(false)}
          discussionId={discussionId}
          replyToId={replyDialogProps.replyToId}
          replyToAuthor={replyDialogProps.replyToAuthor}
          onSuccess={handleReplySuccess}
        />
      </DialogContent>
    </Dialog>
  );
} 