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
import { Layout } from '@/components/layout/Layout';
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
      action: () => navigate('/map?contribute=location')
    },
    {
      icon: <Camera className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Upload Photos",
      description: "Share images of accessibility features to help others navigate.",
      action: () => navigate('/map?contribute=photo')
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Write Reviews",
      description: "Share your experiences about the accessibility of places you've visited.",
      action: () => navigate('/map?contribute=review')
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Report Issues",
      description: "Alert the community about broken elevators, construction, or other barriers.",
      action: () => navigate('/map?contribute=issue')
    }
  ];
  
  return (
    <Layout>
      <main className="flex-1 pt-16">
        <section className="bg-gradient-to-b from-accessBlue/10 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Contribute to Accessibility</h1>
              <p className="text-lg text-gray-600 mb-8">
                Help make the world more accessible by sharing your knowledge and experiences.
                Every contribution makes a difference for people with mobility challenges.
              </p>
              <Button size="lg" className="rounded-full" onClick={() => navigate('/map')}>
                Open Map to Contribute
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Ways to Contribute</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {contributionTypes.map((type, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {type.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      <Button variant="outline" onClick={type.action}>
                        Get Started
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Your Contributions Matter</h2>
              <p className="text-gray-600">
                Every piece of information you share helps someone navigate the world more confidently.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-accessBlue mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
                <p className="text-gray-600">
                  Your contributions directly help people with mobility challenges navigate their daily lives.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center">
                <Star className="h-12 w-12 mx-auto text-accessBlue mb-4" />
                <h3 className="text-xl font-semibold mb-2">Recognition</h3>
                <p className="text-gray-600">
                  Earn badges and recognition as you contribute more to the accessibility community.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center">
                <MapPin className="h-12 w-12 mx-auto text-accessBlue mb-4" />
                <h3 className="text-xl font-semibold mb-2">Better Data</h3>
                <p className="text-gray-600">
                  Help build the most comprehensive accessibility database for your community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </Layout>
  );
};

export default ContributePage;
