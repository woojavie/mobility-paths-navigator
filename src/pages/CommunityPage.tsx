
import { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  User, 
  ThumbsUp, 
  Wheelchair, 
  MapPin,
  Search,
  Star,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
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
      author: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      time: "2 hours ago",
      replies: 12,
      likes: 24,
      excerpt: "I'm planning to visit NYC next month and would love recommendations for parks with good wheelchair accessibility. Looking for smooth paths and accessible restrooms."
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
      location: "Central Park - Bethesda Fountain",
      rating: 4.5,
      author: "Alex T.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      time: "1 week ago",
      content: "Excellent wheelchair accessibility around the fountain area. Paved paths are well-maintained. Bathroom in the Terrace area is fully accessible. Highly recommend!"
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
  
  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-accessOrange text-accessOrange" />);
    }
    
    if (halfStar) {
      stars.push(
        <Star key="half-star" className="h-4 w-4 text-accessOrange" style={{ clipPath: 'inset(0 50% 0 0)', fill: 'currentColor' }} />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-10 px-4 md:px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                AccessPath Community
              </h1>
              
              <p className="text-xl text-gray-600">
                Connect with others, share experiences, and find the most up-to-date 
                accessibility information.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-elevation-1 mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full border-b grid grid-cols-2">
                  <TabsTrigger value="discussions" className="py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accessBlue">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Discussions
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accessBlue">
                    <Star className="h-5 w-5 mr-2" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder={activeTab === "discussions" ? "Search discussions..." : "Search reviews..."}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter className="h-5 w-5" />
                    </Button>
                    <Button className="shrink-0">
                      {activeTab === "discussions" ? "New Discussion" : "Write Review"}
                    </Button>
                  </div>
                  
                  <TabsContent value="discussions" className="mt-0">
                    <div className="space-y-4">
                      {discussions.map(discussion => (
                        <div key={discussion.id} className="border rounded-lg p-4 hover:border-accessBlue transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <img 
                                src={discussion.avatar} 
                                alt={discussion.author}
                                className="h-8 w-8 rounded-full mr-3"
                                loading="lazy"
                              />
                              <span className="font-medium">{discussion.author}</span>
                              <span className="text-gray-500 text-sm ml-2">{discussion.time}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {discussion.replies}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {discussion.likes}
                              </span>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                          <p className="text-gray-600 mb-3">{discussion.excerpt}</p>
                          
                          <Button variant="ghost" className="p-0 h-auto text-accessBlue hover:text-accessBlue-dark hover:bg-transparent">
                            Read more
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-0">
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="border rounded-lg p-4 hover:border-accessBlue transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 text-accessBlue mr-2" />
                              <h3 className="font-semibold">{review.location}</h3>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{review.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={review.avatar} 
                                alt={review.author}
                                className="h-6 w-6 rounded-full mr-2"
                                loading="lazy"
                              />
                              <span className="text-sm text-gray-500">
                                {review.author} • {review.time}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Wheelchair className="h-8 w-8 text-accessBlue mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Join our accessibility community</h2>
              <p className="text-gray-600 mb-4">
                Sign up to participate in discussions, write reviews, and connect with others 
                passionate about accessibility.
              </p>
              <Button className="rounded-full">
                <User className="h-4 w-4 mr-2" />
                Create an Account
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
