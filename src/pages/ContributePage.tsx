
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Camera, 
  MessageSquare, 
  AlertTriangle, 
  Upload,
  ChevronRight,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ContributePage = () => {
  const navigate = useNavigate();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const contributionTypes = [
    {
      icon: <MapPin className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Add Accessible Locations",
      description: "Mark curb cuts, ramps, elevators, and accessible entrances on the map.",
      buttonText: "Add Location",
      action: () => navigate('/map')
    },
    {
      icon: <Camera className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Upload Photos",
      description: "Share photos of accessible features to help others navigate with confidence.",
      buttonText: "Upload Photos",
      action: () => navigate('/map')
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-accessOrange p-2 bg-accessOrange/10 rounded-xl" />,
      title: "Report Barriers",
      description: "Alert the community about temporary obstacles, construction, or broken facilities.",
      buttonText: "Report Barrier",
      action: () => navigate('/map')
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Write Reviews",
      description: "Share your experiences and rate locations based on their accessibility.",
      buttonText: "Write Review",
      action: () => navigate('/community')
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 pt-32 px-4 md:px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accessGreen-light text-accessGreen-dark text-sm font-medium mb-4">
                <Upload className="h-4 w-4 mr-2" />
                <span>Community Contributions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Help Build an Accessible World
              </h1>
              
              <p className="text-xl text-gray-600">
                Your contributions make a difference. Share your knowledge to help others navigate
                with confidence and freedom.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {contributionTypes.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-gray-100 bg-white rounded-xl p-8 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300"
                >
                  <div className="mb-4">
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  
                  <Button onClick={item.action}>
                    {item.buttonText}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Why Your Contributions Matter
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    Every contribution you make helps someone with mobility challenges navigate the world more confidently. Your knowledge creates accessibility for all.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-accessBlue rounded-full p-1 mr-3">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-gray-800">Join a community of 10,000+ contributors</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-accessBlue rounded-full p-1 mr-3">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-gray-800">Help map 50,000+ accessible locations</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-accessBlue rounded-full p-1 mr-3">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-gray-800">Earn badges and recognition for your contributions</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="mt-8 rounded-full"
                    onClick={() => navigate('/map')}
                  >
                    Start Contributing Now
                  </Button>
                </div>
                
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80" 
                    alt="Person contributing to accessibility data"
                    className="w-full h-auto rounded-xl shadow-elevation-2"
                    loading="lazy"
                  />
                  
                  <div className="absolute top-4 right-4 glass-morphism rounded-full px-4 py-2 text-sm font-medium">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-accessOrange mr-2" />
                      Top Contributor
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContributePage;
