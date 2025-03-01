
import { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { 
  MapPin, 
  Navigation, 
  Filter, 
  Layers, 
  ArrowRight, 
  Search,
  Wheelchair,
  Stairs,
  Elevator,
  Construction 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// This is a placeholder API key. In a real application, you'd need to get an actual Google Maps API key
// and properly secure it. For production, it should be stored in environment variables.
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

const AccessMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [activeTab, setActiveTab] = useState("route");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      // For demo purposes only - we're showing a static map
      // In a real app, you'd use the Google Maps API
      if (mapRef.current && !mapLoaded) {
        setMapLoaded(true);
        try {
          const loader = new Loader({
            apiKey: GOOGLE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["places"]
          });
          
          const google = await loader.load();
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 }, // New York City
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
          });
          
          setMapInstance(map);
          
          // Add sample markers for accessible features (would come from API in real app)
          addSampleMarkers(map, google);
          
        } catch (error) {
          console.error("Error loading Google Maps:", error);
        }
      }
    };
    
    // Sample data for accessible features
    const addSampleMarkers = (map: google.maps.Map, google: any) => {
      // Accessible entrances
      const accessibleLocations = [
        { lat: 40.7128, lng: -74.0060, type: 'ramp', title: 'Accessible Ramp' },
        { lat: 40.7138, lng: -74.0070, type: 'elevator', title: 'Elevator Access' },
        { lat: 40.7118, lng: -74.0050, type: 'entrance', title: 'Accessible Entrance' },
        { lat: 40.7135, lng: -74.0040, type: 'bathroom', title: 'Accessible Bathroom' },
        { lat: 40.7145, lng: -74.0065, type: 'barrier', title: 'Construction (Temporary Barrier)' }
      ];
      
      accessibleLocations.forEach(location => {
        let icon;
        
        switch(location.type) {
          case 'ramp':
            icon = {
              url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 9 9 3 15 9"></polyline><polyline points="21 14 15 20 9 14"></polyline></svg>')}`,
              scaledSize: new google.maps.Size(24, 24)
            };
            break;
          case 'elevator':
            icon = {
              url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="16"></line></svg>')}`,
              scaledSize: new google.maps.Size(24, 24)
            };
            break;
          case 'entrance':
            icon = {
              url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>')}`,
              scaledSize: new google.maps.Size(24, 24)
            };
            break;
          case 'bathroom':
            icon = {
              url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"></path><path d="M2 22h20"></path><path d="M12 10V2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><path d="M18 10V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v6"></path></svg>')}`,
              scaledSize: new google.maps.Size(24, 24)
            };
            break;
          case 'barrier':
            icon = {
              url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,2 6,11 12,11 9,22"></polyline><path d="M3 5h18"></path><path d="M3 19h18"></path></svg>')}`,
              scaledSize: new google.maps.Size(24, 24)
            };
            break;
        }
        
        new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.title,
          icon
        });
      });
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
                    <Wheelchair className="h-4 w-4 mr-2 text-accessBlue" />
                    Wheelchair accessible
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="avoid-stairs" />
                  <Label htmlFor="avoid-stairs" className="flex items-center">
                    <Stairs className="h-4 w-4 mr-2 text-accessOrange" />
                    Avoid stairs
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="elevator-required" />
                  <Label htmlFor="elevator-required" className="flex items-center">
                    <Elevator className="h-4 w-4 mr-2 text-accessBlue" />
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
                    <Wheelchair className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Accessible
                  </span>
                  <span className="flex items-center">
                    <Elevator className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Elevator
                  </span>
                </div>
                <p className="text-sm text-gray-600">Ramp entrance on south side, elevator to all floors</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer">
                <h4 className="font-medium">Central Park Zoo</h4>
                <div className="flex space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Wheelchair className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Accessible
                  </span>
                </div>
                <p className="text-sm text-gray-600">Paved paths throughout, accessible restrooms available</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer">
                <h4 className="font-medium">Museum of Modern Art</h4>
                <div className="flex space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Wheelchair className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Accessible
                  </span>
                  <span className="flex items-center">
                    <Elevator className="h-3.5 w-3.5 mr-1 text-accessBlue" />
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
                <User className="h-4 w-4 mr-2" />
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
