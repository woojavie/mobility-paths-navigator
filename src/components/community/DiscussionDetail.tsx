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
  const [replyLikes, setReplyLikes] = useState<Record<string, boolean>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
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
          
          console.log('Reply likes status:', replyLikesStatus);
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
    console.log('Loading discussion with ID:', discussionId, 'Sort order:', sortOrder, 'User:', user?.id);
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
      
      console.log('Like toggled successfully. New state:', !isLiked);
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

  const handleReplyToReply = (replyId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to reply to comments.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Setting active reply ID:', replyId, 'Previous active reply ID:', activeReplyId);
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
    
    // Add a toast notification to confirm the action
    toast({
      title: activeReplyId === replyId ? 'Reply form closed' : 'Reply form opened',
      description: activeReplyId === replyId 
        ? 'The reply form has been closed.' 
        : `You can now reply to this comment.`,
    });
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
    <div className="space-y-6 relative pb-20">
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
        
        {user && (
          <div className="mb-4 mt-6 border-t pt-4 border-gray-100">
            <Button 
              onClick={() => window.location.href = `#reply-form-${discussionId}`}
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
        
        {user ? (
          <Card className="p-6 mb-6 border-4 border-blue-500 bg-blue-50" id={`reply-form-${discussionId}`}>
            <h4 className="font-bold mb-3 text-xl flex items-center text-blue-700">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-700" />
              Add your reply to this discussion
            </h4>
            <ReplyForm 
              discussionId={discussionId} 
              onSuccess={handleReplySuccess} 
              key={`main-reply-form-${discussionId}`}
            />
          </Card>
        ) : (
          <Card className="p-6 mb-6 text-center border-2 border-blue-300 bg-blue-50">
            <p className="text-gray-600 mb-3">Please sign in to reply to this discussion.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
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
                        onClick={() => handleReplyToReply(reply.id)}
                        disabled={!user}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Reply to this comment</span>
                      </Button>
                    </div>
                    
                    {activeReplyId === reply.id && user && (
                      <div className="mt-4 pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-md">
                        <h5 className="text-md font-bold mb-3 flex items-center text-blue-700">
                          <MessageSquare className="h-5 w-5 mr-2 text-blue-700" />
                          Reply to {reply.author}
                        </h5>
                        <ReplyForm 
                          discussionId={discussionId} 
                          replyToId={reply.id}
                          key={`reply-form-${reply.id}`}
                          onSuccess={() => {
                            setActiveReplyId(null);
                            handleReplySuccess();
                          }} 
                        />
                      </div>
                    )}
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
                            onClick={() => handleReplyToReply(nestedReply.id)}
                            disabled={!user}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            <span>Reply to this comment</span>
                          </Button>
                        </div>
                        
                        {activeReplyId === nestedReply.id && user && (
                          <div className="mt-4 pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-md">
                            <h5 className="text-md font-bold mb-3 flex items-center text-blue-700">
                              <MessageSquare className="h-5 w-5 mr-2 text-blue-700" />
                              Reply to {nestedReply.author}
                            </h5>
                            <ReplyForm 
                              discussionId={discussionId} 
                              replyToId={nestedReply.id}
                              key={`reply-form-${nestedReply.id}`}
                              onSuccess={() => {
                                setActiveReplyId(null);
                                handleReplySuccess();
                              }} 
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Fixed floating reply button */}
      {user && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => window.location.href = `#reply-form-${discussionId}`}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
            size="lg"
          >
            <MessageSquare className="h-6 w-6 mr-2" />
            <span className="font-bold">Reply</span>
          </Button>
        </div>
      )}
    </div>
  );
} 