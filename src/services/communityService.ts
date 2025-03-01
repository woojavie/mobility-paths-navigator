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
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
  
  // Transform to Member type
  return data.map(profile => ({
    id: profile.id,
    username: profile.username || 'Anonymous',
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    contributions_count: 0, // This would need to be calculated from other tables
  })) as Member[];
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