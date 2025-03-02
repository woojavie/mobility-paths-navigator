import { supabase } from '@/integrations/supabase/client';

// Types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  user_id: string;
  author: string;
  created_at: string;
  replies_count?: number;
  likes_count?: number;
}

export interface Review {
  id: string;
  place: string;
  location: string;
  rating: number;
  text: string;
  user_id: string;
  author: string;
  created_at: string;
}

export interface Member {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  contributions_count?: number;
}

export interface Reply {
  id: string;
  discussion_id: string;
  content: string;
  user_id: string;
  author: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  parent_reply_id?: string;
}

export interface Like {
  id: string;
  discussion_id?: string;
  reply_id?: string;
  user_id: string;
  created_at: string;
}

// Discussions
export const fetchDiscussions = async (sortOrder: 'newest' | 'oldest' = 'newest') => {
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .order('created_at', { ascending: sortOrder === 'oldest' });
    
  if (error) {
    console.error('Error fetching discussions:', error);
    throw error;
  }
  
  return data as Discussion[];
};

export const createDiscussion = async (discussion: Omit<Discussion, 'id' | 'created_at' | 'replies_count' | 'likes_count'>) => {
  const { data, error } = await supabase
    .from('discussions')
    .insert([discussion])
    .select();
    
  if (error) {
    console.error('Error creating discussion:', error);
    throw error;
  }
  
  return data[0] as Discussion;
};

// Get a single discussion with its details
export const fetchDiscussionById = async (id: string) => {
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching discussion:', error);
    throw error;
  }
  
  return data as Discussion;
};

// Fetch replies for a discussion
export const fetchReplies = async (discussionId: string, sortOrder: 'newest' | 'oldest' = 'newest') => {
  const { data, error } = await supabase
    .from('discussion_replies')
    .select('*')
    .eq('discussion_id', discussionId)
    .order('created_at', { ascending: sortOrder === 'oldest' });
    
  if (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
  
  return data as Reply[];
};

// Add a reply to a discussion
export const createReply = async (reply: Omit<Reply, 'id' | 'created_at' | 'updated_at' | 'likes_count'>) => {
  console.log('communityService: createReply called with', reply);
  
  if (!reply.discussion_id) {
    console.error('Error creating reply: discussion_id is required');
    throw new Error('Discussion ID is required');
  }
  
  if (!reply.user_id) {
    console.error('Error creating reply: user_id is required');
    throw new Error('User ID is required');
  }
  
  if (!reply.content) {
    console.error('Error creating reply: content is required');
    throw new Error('Content is required');
  }
  
  try {
    // First try with all fields including parent_reply_id if provided
    const { data, error } = await supabase
      .from('discussion_replies')
      .insert([reply])
      .select();
      
    if (error) {
      console.error('Error creating reply:', error);
      
      // If the error is about parent_reply_id column not existing, try again without it
      if (error.message && error.message.includes('column "parent_reply_id" does not exist') && reply.parent_reply_id) {
        console.log('parent_reply_id column does not exist, retrying without it');
        
        // Create a new object without parent_reply_id
        const { parent_reply_id, ...replyWithoutParent } = reply;
        
        const retryResult = await supabase
          .from('discussion_replies')
          .insert([replyWithoutParent])
          .select();
          
        if (retryResult.error) {
          console.error('Error on retry without parent_reply_id:', retryResult.error);
          throw retryResult.error;
        }
        
        console.log('Reply created successfully without parent_reply_id:', retryResult.data);
        return retryResult.data[0] as Reply;
      }
      
      // Provide more specific error messages
      if (error.code === '23503') { // Foreign key violation
        console.error('Foreign key constraint failed. Discussion or parent reply may not exist.');
        throw new Error('The discussion or parent reply you are responding to may have been deleted');
      } else if (error.code === '23502') { // Not null violation
        console.error('Not null constraint failed. Missing required field.');
        throw new Error('Missing required field');
      }
      
      throw error;
    }
    
    console.log('Reply created successfully:', data);
    return data[0] as Reply;
  } catch (error) {
    console.error('Exception in createReply:', error);
    throw error;
  }
};

// Helper function to validate like parameters
const validateLikeParams = (operation: string, userId: string, discussionId?: string, replyId?: string) => {
  if (!userId) {
    const errorMsg = `Error ${operation} like: User ID is required`;
    console.error(errorMsg);
    throw new Error('User ID is required');
  }
  
  if ((!discussionId && !replyId) || (discussionId && replyId)) {
    const errorMsg = `Error ${operation} like: Either discussionId OR replyId must be provided, but not both or neither`;
    console.error(errorMsg);
    throw new Error('Invalid parameters: Either discussionId OR replyId must be provided');
  }
};

// Check if a user has liked a discussion
export const checkIfLiked = async (userId: string, discussionId?: string, replyId?: string) => {
  validateLikeParams('checking', userId, discussionId, replyId);

  let query = supabase
    .from('discussion_likes')
    .select('id')
    .eq('user_id', userId);
    
  if (discussionId) {
    query = query.eq('discussion_id', discussionId);
  } else {
    query = query.eq('reply_id', replyId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking like status:', error);
    throw error;
  }
  
  return data.length > 0;
};

// Like a discussion or reply
export const addLike = async (userId: string, discussionId?: string, replyId?: string) => {
  validateLikeParams('adding', userId, discussionId, replyId);

  // First check if already liked to provide a better error message
  const isAlreadyLiked = await checkIfLiked(userId, discussionId, replyId);
  if (isAlreadyLiked) {
    const target = discussionId ? 'discussion' : 'reply';
    const errorMsg = `User ${userId} has already liked this ${target}`;
    console.error(errorMsg);
    throw new Error(`You have already liked this ${target}`);
  }

  const { data, error } = await supabase
    .from('discussion_likes')
    .insert([{
      user_id: userId,
      discussion_id: discussionId || null,
      reply_id: replyId || null
    }])
    .select();
    
  if (error) {
    console.error('Error adding like:', error);
    
    // Provide more specific error messages
    if (error.code === '23505') { // Unique violation
      throw new Error('You have already liked this item');
    } else if (error.code === '23503') { // Foreign key violation
      throw new Error('The item you are trying to like may have been deleted');
    }
    
    throw error;
  }
  
  return data[0] as Like;
};

// Unlike a discussion or reply
export const removeLike = async (userId: string, discussionId?: string, replyId?: string) => {
  validateLikeParams('removing', userId, discussionId, replyId);

  // First check if the like exists
  const isLiked = await checkIfLiked(userId, discussionId, replyId);
  if (!isLiked) {
    const target = discussionId ? 'discussion' : 'reply';
    const errorMsg = `User ${userId} has not liked this ${target}`;
    console.error(errorMsg);
    throw new Error(`You have not liked this ${target}`);
  }

  let query = supabase
    .from('discussion_likes')
    .delete()
    .eq('user_id', userId);
    
  if (discussionId) {
    query = query.eq('discussion_id', discussionId);
  } else {
    query = query.eq('reply_id', replyId);
  }
  
  const { error } = await query;
  
  if (error) {
    console.error('Error removing like:', error);
    
    // Provide more specific error messages
    if (error.code === '23503') { // Foreign key violation
      throw new Error('The item you are trying to unlike may have been deleted');
    }
    
    throw error;
  }
  
  return true;
};

// Reviews
export const fetchReviews = async (sortOrder: 'newest' | 'oldest' = 'newest') => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: sortOrder === 'oldest' });
    
  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
  
  return data as Review[];
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select();
    
  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }
  
  return data[0] as Review;
};

// Members
export const fetchMembers = async () => {
  // Get all profiles
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .order('created_at', { ascending: false });
    
  if (profilesError) {
    console.error('Error fetching members:', profilesError);
    throw profilesError;
  }
  
  // Get all discussions to count contributions
  const { data: discussionsData, error: discussionsError } = await supabase
    .from('discussions')
    .select('user_id');
    
  if (discussionsError) {
    console.error('Error fetching discussions:', discussionsError);
  }
  
  // Get all reviews to count contributions
  const { data: reviewsData, error: reviewsError } = await supabase
    .from('reviews')
    .select('user_id');
    
  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  }
  
  // Count contributions for each user
  const contributionCounts = new Map<string, number>();
  
  discussionsData?.forEach(discussion => {
    const userId = discussion.user_id;
    contributionCounts.set(userId, (contributionCounts.get(userId) || 0) + 1);
  });
  
  reviewsData?.forEach(review => {
    const userId = review.user_id;
    contributionCounts.set(userId, (contributionCounts.get(userId) || 0) + 1);
  });
  
  // Get all users with their emails to extract usernames
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  // Transform profiles to Member type
  const members = profilesData.map(profile => {
    // Try to extract username from email if the current user's profile
    let username = profile.username;
    if (!username && authData?.user && profile.id === authData.user.id) {
      username = authData.user.email?.split('@')[0] || 'Anonymous';
    }
    
    return {
      id: profile.id,
      username: username || 'User' + profile.id.substring(0, 4),
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      contributions_count: contributionCounts.get(profile.id) || 0
    };
  });
  
  return members as Member[];
};

// Utility function to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}; 