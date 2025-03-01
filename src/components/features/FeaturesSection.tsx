
import { 
  Map, 
  Users, 
  Route, 
  Construction, 
  MessageSquare, 
  Star,
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Map className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Accessible Mapping",
      description: "Detailed information about wheelchair-accessible routes, ramps, elevators, and accessible entrances.",
      action: () => navigate('/map')
    },
    {
      icon: <Route className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Personalized Routes",
      description: "Customize your journey based on your specific mobility needs and preferences.",
      action: () => navigate('/map')
    },
    {
      icon: <Users className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Community Contributions",
      description: "Real-time updates from our community about accessibility features and barriers.",
      action: () => navigate('/contribute')
    },
    {
      icon: <Construction className="h-10 w-10 text-accessOrange p-2 bg-accessOrange/10 rounded-xl" />,
      title: "Barrier Alerts",
      description: "Stay informed about temporary obstacles like construction or broken elevators.",
      action: () => navigate('/map')
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-accessBlue p-2 bg-accessBlue/10 rounded-xl" />,
      title: "Community Forum",
      description: "Connect with others to share experiences and accessibility tips for different locations.",
      action: () => navigate('/community')
    },
    {
      icon: <Star className="h-10 w-10 text-accessOrange p-2 bg-accessOrange/10 rounded-xl" />,
      title: "Location Ratings",
      description: "Access and contribute to accessibility ratings and reviews for public spaces.",
      action: () => navigate('/community')
    }
  ];
  
  return (
    <section className="py-20 bg-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features designed for accessibility</h2>
          <p className="text-xl text-gray-600">
            AccessPath combines detailed mapping with community insights to create the most comprehensive
            accessibility navigation experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="border border-gray-100 bg-white rounded-xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-accessBlue hover:text-accessBlue-dark hover:bg-transparent"
                onClick={feature.action}
              >
                Learn more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
