import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  MessageSquare, 
  User, 
  ThumbsUp, 
  Accessibility,
  MapPin,
  Search,
  Star,
  Filter,
  Loader2,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { 
  fetchDiscussions, 
  fetchReviews, 
  fetchMembers,
  formatDate,
  type Discussion,
  type Review,
  type Member
} from '@/services/communityService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNewContent, setHasNewContent] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const subscriptionRef = useRef<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Function to load data based on active tab
  const loadData = useCallback(async (tabName: string, forceRefresh = false) => {
    setIsLoading(true);
    setHasNewContent(false);
    try {
      if (tabName === 'discussions' && (discussions.length === 0 || forceRefresh)) {
        const data = await fetchDiscussions(sortOrder);
        setDiscussions(data);
      } else if (tabName === 'reviews' && (reviews.length === 0 || forceRefresh)) {
        const data = await fetchReviews(sortOrder);
        setReviews(data);
      } else if (tabName === 'members' && (members.length === 0 || forceRefresh)) {
        const data = await fetchMembers();
        setMembers(data);
      }
    } catch (error) {
      console.error(`Error loading ${tabName}:`, error);
      toast({
        title: "Error loading data",
        description: `There was a problem loading ${tabName}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [discussions.length, reviews.length, members.length, toast, sortOrder]);
  
  // Load data based on active tab
  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);
  
  // Set up real-time subscriptions
  useEffect(() => {
    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    
    // Set up subscription based on active tab
    if (activeTab === 'discussions') {
      subscriptionRef.current = supabase
        .channel('discussions-changes')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'discussions' 
        }, () => {
          setHasNewContent(true);
        })
        .subscribe();
    } else if (activeTab === 'reviews') {
      subscriptionRef.current = supabase
        .channel('reviews-changes')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'reviews' 
        }, () => {
          setHasNewContent(true);
        })
        .subscribe();
    }
    
    // Clean up subscription on unmount or tab change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [activeTab]);
  
  // Handle refresh after new post
  const handleNewPost = async () => {
    await loadData(activeTab, true);
    toast({
      title: "Content updated",
      description: "Your post has been published successfully!",
      variant: "default",
    });
  };
  
  // Handle sort order change
  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newSortOrder);
    loadData(activeTab, true);
    toast({
      title: `Sorting by ${newSortOrder}`,
      description: `Showing ${newSortOrder} content first`,
    });
  };
  
  // Filter data based on search query
  const filteredDiscussions = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredReviews = reviews.filter(review => 
    review.place.toLowerCase().includes(searchQuery.toLowerCase()) || 
    review.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMembers = members.filter(member => 
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  // Loading state component
  const LoadingState = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-accessBlue" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
  
  // Empty state component
  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <div className="mb-4">
        {type === 'discussions' && <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />}
        {type === 'reviews' && <Star className="h-12 w-12 mx-auto text-gray-300" />}
        {type === 'members' && <User className="h-12 w-12 mx-auto text-gray-300" />}
      </div>
      <h3 className="text-lg font-medium text-gray-700">No {type} found</h3>
      <p className="text-gray-500 mt-1">
        {searchQuery 
          ? `No ${type} match your search criteria.` 
          : `Be the first to add a ${type.slice(0, -1)}!`}
      </p>
      {user && type !== 'members' && (
        <div className="mt-6">
          <NewPostDialog 
            defaultTab={type === 'discussions' ? 'discussion' : 'review'} 
            onSuccess={handleNewPost}
          />
        </div>
      )}
    </div>
  );
  
  // Function to handle manual refresh
  const handleManualRefresh = () => {
    loadData(activeTab, true);
    toast({
      title: "Refreshing content",
      description: "Loading the latest community content...",
    });
  };
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Layout>
      <main className="flex-1 pt-16">
        <section className="bg-gradient-to-b from-accessBlue/10 to-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Accessibility Community</h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with others, share experiences, and learn about accessibility in your area.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Input 
                  type="text" 
                  placeholder="Search discussions, reviews, or members..." 
                  className="pl-10 pr-4 py-3 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="discussions" className="w-full" onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <TabsList className="mb-4 md:mb-0">
                  <TabsTrigger value="discussions" className="data-[state=active]:bg-accessBlue data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discussions
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-accessBlue data-[state=active]:text-white">
                    <Star className="h-4 w-4 mr-2" />
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger value="members" className="data-[state=active]:bg-accessBlue data-[state=active]:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Members
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex flex-wrap items-center gap-3">
                  {hasNewContent && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleManualRefresh}
                      className="animate-pulse border-accessBlue text-accessBlue"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      New content available
                    </Button>
                  )}
                
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleManualRefresh} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                      </svg>
                    )}
                    Refresh
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSortOrderChange}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className={`h-4 w-4 mr-2 ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
                          >
                            <path d="m3 8 4-4 4 4" />
                            <path d="M7 4v16" />
                            <path d="m21 16-4 4-4-4" />
                            <path d="M17 20V4" />
                          </svg>
                          Sort: {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change sort order</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {user && activeTab !== 'members' && (
                    <NewPostDialog 
                      defaultTab={activeTab === 'discussions' ? 'discussion' : 'review'} 
                      onSuccess={handleNewPost}
                    />
                  )}
                </div>
              </div>
              
              <TabsContent value="discussions" className="mt-0">
                {isLoading ? (
                  <LoadingState />
                ) : filteredDiscussions.length === 0 ? (
                  <EmptyState type="discussions" />
                ) : (
                  <div className="space-y-6">
                    {filteredDiscussions.map(discussion => (
                      <div key={discussion.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-2">{discussion.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <User className="h-4 w-4 mr-1" />
                          <span>{discussion.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(discussion.created_at)}</span>
                          {new Date(discussion.created_at).getTime() > Date.now() - 86400000 && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">New</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4">{truncateText(discussion.content, 250)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{discussion.replies_count || 0} replies</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{discussion.likes_count || 0} likes</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Read More</Button>
                        </div>
                      </div>
                    ))}
                    
                    {filteredDiscussions.length > 0 && filteredDiscussions.length >= 10 && (
                      <div className="text-center mt-8">
                        <Button>Load More Discussions</Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                {isLoading ? (
                  <LoadingState />
                ) : filteredReviews.length === 0 ? (
                  <EmptyState type="reviews" />
                ) : (
                  <div className="space-y-6">
                    {filteredReviews.map(review => (
                      <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{review.place}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{review.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{truncateText(review.text, 250)}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          <span>{review.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(review.created_at)}</span>
                          {new Date(review.created_at).getTime() > Date.now() - 86400000 && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">New</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {filteredReviews.length > 0 && filteredReviews.length >= 10 && (
                      <div className="text-center mt-8">
                        <Button>Load More Reviews</Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="members" className="mt-0">
                {isLoading ? (
                  <LoadingState />
                ) : filteredMembers.length === 0 ? (
                  <EmptyState type="members" />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map(member => (
                      <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow flex items-center">
                        <Avatar className="w-16 h-16 mr-4">
                          <AvatarImage src={member.avatar_url} alt={member.username} />
                          <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.username}</h3>
                          <div className="text-sm text-gray-500 mb-1">
                            Joined {formatDate(member.created_at)}
                          </div>
                          <div className="flex items-center text-accessBlue text-sm">
                            <Accessibility className="h-4 w-4 mr-1" />
                            <span>{member.contributions_count || 0} contributions</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {filteredMembers.length > 0 && filteredMembers.length >= 12 && (
                  <div className="text-center mt-8">
                    <Button>View More Members</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </Layout>
  );
};

export default CommunityPage;
