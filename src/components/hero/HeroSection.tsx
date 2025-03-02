import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Accessibility, Route, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [preferences, setPreferences] = useState({
    wheelchairAccessible: false,
    avoidStairs: false
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleFindRoute = () => {
    if (!startLocation || !destination) {
      return;
    }
    
    // Navigate to map page with route parameters
    navigate('/map', {
      state: {
        startLocation,
        destination,
        preferences: {
          wheelchairAccessible: preferences.wheelchairAccessible,
          avoidStairs: preferences.avoidStairs,
          elevatorRequired: false,
          avoidConstruction: false
        }
      }
    });
  };
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 md:px-6 pt-20 pb-16">
      <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className={`space-y-6 ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accessGreen-light text-accessGreen-dark text-sm font-medium">
            <Accessibility className="h-4 w-4 mr-2" />
            <span>Accessible navigation made simple</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Navigate with <span className="text-accessBlue">confidence</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg">
            AccessPath helps people with mobility challenges find and navigate accessible routes with detailed accessibility information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/map')}
              className="rounded-full shadow-button"
            >
              Explore Accessible Routes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full"
              onClick={() => navigate('/contribute')}
            >
              Contribute Data
            </Button>
          </div>
          
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center">
              <Route className="h-5 w-5 text-accessBlue mr-2" />
              <span className="text-gray-600">Wheelchair accessible routes</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-accessOrange mr-2" />
              <span className="text-gray-600">Community verified</span>
            </div>
          </div>
        </div>
        
        <div className={`relative ${isVisible ? 'animate-slide-up opacity-100 animate-delay-200' : 'opacity-0'}`}>
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-accessBlue/5 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-accessGreen/5 rounded-full filter blur-3xl"></div>
          
          <div className="relative glass-morphism rounded-2xl p-6 shadow-glass overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accessBlue to-accessGreen"></div>
            
            <h3 className="text-lg font-medium mb-4">Find Accessible Routes</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Current location"
                  className="pl-10 rounded-lg border border-gray-200"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Where to?"
                  className="pl-10 rounded-lg border border-gray-200"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant={preferences.wheelchairAccessible ? "default" : "outline"} 
                  className="rounded-lg border border-gray-200"
                  onClick={() => setPreferences(prev => ({ ...prev, wheelchairAccessible: !prev.wheelchairAccessible }))}
                >
                  <Accessibility className="h-4 w-4 mr-2" />
                  Wheelchair
                </Button>
                <Button 
                  variant={preferences.avoidStairs ? "default" : "outline"}
                  className="rounded-lg border border-gray-200"
                  onClick={() => setPreferences(prev => ({ ...prev, avoidStairs: !prev.avoidStairs }))}
                >
                  <Route className="h-4 w-4 mr-2" />
                  Avoid Stairs
                </Button>
              </div>
              
              <Button 
                className="w-full rounded-lg" 
                onClick={handleFindRoute}
                disabled={!startLocation || !destination}
              >
                Find Route
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Popular Accessible Destinations</h4>
              <ul className="space-y-2 text-sm">
                <li 
                  className="flex items-center hover:text-accessBlue cursor-pointer transition-colors"
                  onClick={() => setDestination("Central Park (Accessible Entrance)")}
                >
                  <MapPin className="h-4 w-4 mr-2 text-accessBlue" />
                  Central Park (Accessible Entrance)
                </li>
                <li 
                  className="flex items-center hover:text-accessBlue cursor-pointer transition-colors"
                  onClick={() => setDestination("Metropolitan Museum of Art")}
                >
                  <MapPin className="h-4 w-4 mr-2 text-accessBlue" />
                  Metropolitan Museum of Art
                </li>
                <li 
                  className="flex items-center hover:text-accessBlue cursor-pointer transition-colors"
                  onClick={() => setDestination("Times Square Visitor Center")}
                >
                  <MapPin className="h-4 w-4 mr-2 text-accessBlue" />
                  Times Square Visitor Center
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
