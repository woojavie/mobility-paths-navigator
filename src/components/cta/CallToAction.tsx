
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-br from-accessBlue to-accessBlue-dark text-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm mb-6">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Join AccessPath today</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start navigating with confidence
          </h2>
          
          <p className="text-xl mb-8 text-blue-50">
            Discover accessible routes, contribute to our community, and help make 
            the world more navigable for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/map')}
              className="rounded-full shadow-button"
            >
              Explore the Map
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full text-white border-white/30 hover:bg-white/10"
              onClick={() => navigate('/contribute')}
            >
              Join the Community
            </Button>
          </div>
          
          <p className="text-sm text-blue-100 mt-8">
            Free to use. Join thousands of users making navigation more accessible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
