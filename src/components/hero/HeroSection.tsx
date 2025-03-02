import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Accessibility, Route, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationSearchInput from '@/components/map/LocationSearchInput';

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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-accessBlue/5 to-white py-20">
      <div className={`container mx-auto px-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accessBlue to-accessGreen bg-clip-text text-transparent">
              Navigate Your World Without Barriers
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Find accessible routes and discover wheelchair-friendly places in your city
            </p>
          </div>
          
          <div className="relative glass-morphism rounded-2xl p-6 shadow-glass overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accessBlue to-accessGreen"></div>
            
            <h3 className="text-lg font-medium mb-4">Find Accessible Routes</h3>
            
            <div className="space-y-4">
              <LocationSearchInput
                placeholder="Current location"
                value={startLocation}
                onChange={setStartLocation}
                className="w-full"
              />
              
              <LocationSearchInput
                placeholder="Where to?"
                value={destination}
                onChange={setDestination}
                className="w-full"
              />
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={preferences.wheelchairAccessible}
                    onChange={(e) => setPreferences(prev => ({ ...prev, wheelchairAccessible: e.target.checked }))}
                    className="rounded border-gray-300 text-accessBlue focus:ring-accessBlue"
                  />
                  <span>Wheelchair accessible</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={preferences.avoidStairs}
                    onChange={(e) => setPreferences(prev => ({ ...prev, avoidStairs: e.target.checked }))}
                    className="rounded border-gray-300 text-accessBlue focus:ring-accessBlue"
                  />
                  <span>Avoid stairs</span>
                </label>
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleFindRoute}
                disabled={!startLocation || !destination}
              >
                <Route className="w-5 h-5 mr-2" />
                Find Route
              </Button>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accessBlue/10 flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-accessBlue" />
              </div>
              <h3 className="font-medium mb-2">Accessible Routes</h3>
              <p className="text-sm text-gray-600">Find wheelchair-friendly paths with detailed accessibility information</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accessGreen/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accessGreen" />
              </div>
              <h3 className="font-medium mb-2">Points of Interest</h3>
              <p className="text-sm text-gray-600">Discover accessible locations, entrances, and facilities nearby</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accessOrange/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-accessOrange" />
              </div>
              <h3 className="font-medium mb-2">Community Driven</h3>
              <p className="text-sm text-gray-600">Share and learn from others' experiences and accessibility reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
