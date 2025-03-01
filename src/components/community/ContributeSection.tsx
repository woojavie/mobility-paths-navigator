
import { 
  Upload, 
  MapPin, 
  MessageSquare, 
  Camera, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ContributeSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accessOrange-light text-accessOrange-dark text-sm font-medium mb-6">
              <Upload className="h-4 w-4 mr-2" />
              <span>Community contributions</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Help make the world more accessible
            </h2>
            
            <p className="text-xl text-gray-600 mb-6">
              Join our community in mapping accessible paths. Your contributions make a difference 
              for everyone facing mobility challenges.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-accessBlue/10 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-accessBlue" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Add accessible locations</h3>
                  <p className="text-gray-600">
                    Mark wheelchair ramps, elevators, and accessible entrances on the map.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accessBlue/10 p-2 rounded-lg mr-4">
                  <Camera className="h-5 w-5 text-accessBlue" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Upload photos</h3>
                  <p className="text-gray-600">
                    Photos help others know what to expect at each location.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accessOrange/10 p-2 rounded-lg mr-4">
                  <AlertTriangle className="h-5 w-5 text-accessOrange" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Report barriers</h3>
                  <p className="text-gray-600">
                    Alert the community about temporary obstacles or broken facilities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accessBlue/10 p-2 rounded-lg mr-4">
                  <MessageSquare className="h-5 w-5 text-accessBlue" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Share experiences</h3>
                  <p className="text-gray-600">
                    Leave reviews and tips about accessibility at different locations.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/contribute')}
              className="rounded-full shadow-button"
            >
              Start Contributing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accessGreen/10 rounded-full filter blur-3xl"></div>
            
            <div className="rounded-2xl overflow-hidden shadow-elevation-3">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="People collaborating on accessibility mapping"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="absolute -bottom-8 -right-8 md:bottom-8 md:right-8 glass-morphism rounded-lg p-4 max-w-xs shadow-elevation-2">
              <div className="flex items-center mb-2">
                <div className="bg-accessBlue rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">New Contribution</h4>
                  <p className="text-xs text-gray-600">Just now</p>
                </div>
              </div>
              <p className="text-sm">
                "Added elevator location at Main St Station - east entrance has new wheelchair access"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContributeSection;
