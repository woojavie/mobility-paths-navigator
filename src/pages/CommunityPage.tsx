import { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  User, 
  ThumbsUp, 
  Accessibility,
  MapPin,
  Search,
  Star,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Sample data for discussions
  const discussions = [
    {
      id: 1,
      title: "Best wheelchair accessible parks in NYC?",
      author: "WheelExplorer",
      date: "2 days ago",
      replies: 12,
      likes: 24,
      excerpt: "I'm planning a trip to New York City and would love recommendations for parks that are truly wheelchair accessible with good pathways and facilities."
    },
    {
      id: 2,
      title: "Elevator at Main St Station is out of service",
      author: "Michael C.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      time: "Yesterday",
      replies: 8,
      likes: 15,
      excerpt: "Just wanted to alert everyone that the elevator at Main St Station's north entrance is currently out of service. Maintenance says it should be fixed by Friday."
    },
    {
      id: 3,
      title: "New accessible restaurant recommendations",
      author: "Emily R.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
      time: "2 days ago",
      replies: 24,
      likes: 42,
      excerpt: "I've been compiling a list of restaurants with great accessibility features. Would love to share and get your additions! Looking for places with proper space between tables."
    }
  ];
  
  // Sample data for reviews
  const reviews = [
    {
      id: 1,
      place: "Central Park",
      location: "New York, NY",
      author: "AccessibilityAdvocate",
      date: "1 week ago",
      rating: 4.5,
      text: "Most paths are well-maintained and accessible. The Bethesda Terrace area has ramps and elevators. Restrooms are accessible but can be far apart."
    },
    {
      id: 2,
      location: "Metropolitan Museum of Art",
      rating: 5,
      author: "Julia M.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      time: "2 weeks ago",
      content: "One of the most accessible museums I've visited. Elevators to all floors, wide spaces between exhibits, and helpful staff. Accessible restrooms on every floor."
    },
    {
      id: 3,
      location: "Grand Central Terminal",
      rating: 3.5,
      author: "David P.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      time: "3 weeks ago",
      content: "Good accessibility overall but can be crowded. Main concourse is easy to navigate, but some food vendors have high counters. Elevator to lower concourse sometimes has long waits."
    }
  ];
  
  // Sample data for members
  const members = [
    {
      id: 1,
      name: "AccessibilityAdvocate",
      contributions: 156,
      joined: "1 year ago",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
  ];
  
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
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="discussions" className="w-full" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-8">
                <TabsList>
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
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <TabsContent value="discussions" className="mt-0">
                <div className="space-y-6">
                  {discussions.map(discussion => (
                    <div key={discussion.id} className="bg-white rounded-xl p-6 shadow-sm border">
                      <h3 className="text-xl font-semibold mb-2">{discussion.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span>{discussion.author}</span>
                        <span className="mx-2">•</span>
                        <span>{discussion.date}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{discussion.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-500">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Read More</Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-8">
                    <Button>Load More Discussions</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border">
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
                      <p className="text-gray-700 mb-4">{review.content}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{review.author}</span>
                        <span className="mx-2">•</span>
                        <span>{review.time}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-8">
                    <Button>Load More Reviews</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map(member => (
                    <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border flex items-center">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <div className="text-sm text-gray-500 mb-1">Joined {member.joined}</div>
                        <div className="flex items-center text-accessBlue text-sm">
                          <Accessibility className="h-4 w-4 mr-1" />
                          <span>{member.contributions} contributions</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button>View More Members</Button>
                </div>
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
