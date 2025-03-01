import { useRef, useEffect, useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Filter, 
  Layers, 
  ArrowRight, 
  Search,
  Accessibility,
  Stars,
  ArrowUp,
  Construction,
  UserRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Define the google maps types
type GoogleMapType = any;
type GoogleMapsLoaderType = any;

const AccessMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<GoogleMapType | null>(null);
  const [activeTab, setActiveTab] = useState("route");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      // For demo purposes only - we're showing a static map
      if (mapRef.current && !mapLoaded) {
        setMapLoaded(true);
        try {
          // In a real app, you'd use the Google Maps JavaScript API or Mapbox
          // This is a placeholder demonstration
          console.log("Map would initialize here with proper API keys");
          
          // Mock the map instance
          const mockMap = {
            setCenter: () => {},
            setZoom: () => {},
            addListener: () => {}
          };
          
          setMapInstance(mockMap as GoogleMapType);
          
          // Add sample markers for accessible features (would come from API in real app)
          addSampleMarkers();
          
        } catch (error) {
          console.error("Error loading Map:", error);
        }
      }
    };
    
    // Sample data for accessible features - simplified for now
    const addSampleMarkers = () => {
      console.log("Sample markers would be added here");
    };
    
    initMap();
  }, [mapLoaded]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="h-screen w-full flex relative">
      {/* Map Controls */}
      <div className="absolute top-20 right-4 z-10 flex flex-col space-y-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full glass-morphism shadow-button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <ArrowRight className="h-5 w-5" /> : <ArrowRight className="h-5 w-5 rotate-180" />}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full glass-morphism shadow-button"
          aria-label="Filter map"
        >
          <Filter className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full glass-morphism shadow-button"
          aria-label="Change layers"
        >
          <Layers className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full glass-morphism shadow-button"
          aria-label="My location"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Map Container */}
      <div ref={mapRef} className="flex-1 h-full bg-gray-100">
        {/* Map loads here */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">Map will appear here with proper API integration</p>
        </div>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-full md:w-96' : 'w-0 overflow-hidden'
        }`}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200">
            <TabsList className="w-full">
              <TabsTrigger value="route" className="flex-1">Route</TabsTrigger>
              <TabsTrigger value="explore" className="flex-1">Explore</TabsTrigger>
              <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="route" className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
            <div className="space-y-2">
              <label htmlFor="start" className="text-sm font-medium text-gray-700">Start</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="start"
                  placeholder="Current location"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="destination"
                  placeholder="Enter destination"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Accessibility Preferences</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="wheelchair-required" />
                  <Label htmlFor="wheelchair-required" className="flex items-center">
                    <Accessibility className="h-4 w-4 mr-2 text-accessBlue" />
                    Wheelchair accessible
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="avoid-stairs" />
                  <Label htmlFor="avoid-stairs" className="flex items-center">
                    <Stars className="h-4 w-4 mr-2 text-accessOrange" />
                    Avoid stairs
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="elevator-required" />
                  <Label htmlFor="elevator-required" className="flex items-center">
                    <ArrowUp className="h-4 w-4 mr-2 text-accessBlue" />
                    Elevator required
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="avoid-construction" defaultChecked />
                  <Label htmlFor="avoid-construction" className="flex items-center">
                    <Construction className="h-4 w-4 mr-2 text-accessOrange" />
                    Avoid construction
                  </Label>
                </div>
              </div>
            </div>
            
            <Button className="w-full">
              Find Accessible Route
            </Button>
            
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Sample Route</h3>
              <p className="text-sm text-gray-600">Example of an accessible route from Central Park to Times Square with elevator access.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="bg-accessBlue rounded-full p-1 mt-0.5">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <p>Head east on W 59th St toward 5th Ave (wheelchair accessible sidewalk)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-accessBlue rounded-full p-1 mt-0.5">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <p>Take elevator at 5th Ave subway station (South entrance)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-accessBlue rounded-full p-1 mt-0.5">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <p>Board accessible N train toward Times Square</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-accessBlue rounded-full p-1 mt-0.5">
                    <span className="text-white text-xs">4</span>
                  </div>
                  <p>Exit at Times Square station using elevator at NW corner</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="explore" className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search for accessible places"
                className="pl-10"
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium">Nearby Accessible Places</h3>
              <p className="text-sm text-gray-600">Explore wheelchair accessible locations in this area</p>
            </div>
            
            <div className="space-y-3">
              <div className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer">
                <h4 className="font-medium">Public Library</h4>
                <div className="flex space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Accessibility className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Accessible
                  </span>
                  <span className="flex items-center">
                    <ArrowUp className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Elevator
                  </span>
                </div>
                <p className="text-sm text-gray-600">Ramp entrance on south side, elevator to all floors</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer">
                <h4 className="font-medium">Central Park Zoo</h4>
                <div className="flex space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Accessibility className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Accessible
                  </span>
                </div>
                <p className="text-sm text-gray-600">Paved paths throughout, accessible restrooms available</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer">
                <h4 className="font-medium">Museum of Modern Art</h4>
                <div className="flex space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Accessibility className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Accessible
                  </span>
                  <span className="flex items-center">
                    <ArrowUp className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Elevator
                  </span>
                </div>
                <p className="text-sm text-gray-600">Multiple accessible entrances, elevators to all galleries</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
            <div className="space-y-1">
              <h3 className="font-medium">Saved Places</h3>
              <p className="text-sm text-gray-600">Your favorite accessible locations</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">Sign in to save your favorite accessible places and routes</p>
              <Button variant="outline" className="mt-3">
                <UserRound className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccessMap;
