
import { useRef, useEffect, useState, useCallback } from 'react';
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
  UserRound,
  Loader2
} from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define types for Google Maps
// This addresses the "Cannot find namespace 'google'" errors
type GoogleMapType = google.maps.Map;
type MarkerType = google.maps.Marker;
type InfoWindowType = google.maps.InfoWindow;

// Type definitions for our data models
type AccessibilityPointType = 'elevator' | 'ramp' | 'accessible_entrance' | 'accessible_bathroom' | 'tactile_paving' | 'handicap_parking';
type AccessibilityIssueType = 'construction' | 'broken_elevator' | 'blocked_path' | 'temporary_closure' | 'other';

type AccessibilityPoint = {
  id: string;
  type: AccessibilityPointType;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  is_operational: boolean;
  verified: boolean;
};

type AccessibilityIssue = {
  id: string;
  type: AccessibilityIssueType;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string | null;
  verified: boolean;
};

// Map icon configurations based on point type
const getMarkerIcon = (type: string, isOperational = true) => {
  // For demo purposes, we'll use simple colors
  const colors: {[key: string]: string} = {
    elevator: '#4285F4',          // Blue
    ramp: '#34A853',              // Green
    accessible_entrance: '#4285F4', // Blue
    accessible_bathroom: '#673AB7', // Purple
    tactile_paving: '#FF9800',    // Orange
    handicap_parking: '#0F9D58',  // Green
    construction: '#EA4335',      // Red
    broken_elevator: '#EA4335',   // Red
    blocked_path: '#EA4335',      // Red
    temporary_closure: '#EA4335', // Red
    other: '#757575',             // Gray
  };
  
  // Create a custom marker (this will work once google maps is loaded)
  return {
    path: 'M 12,2 C 8.13,2 5,5.13 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.87 -3.13,-7 -7,-7 z M 12,11.5 c -1.38,0 -2.5,-1.12 -2.5,-2.5 0,-1.38 1.12,-2.5 2.5,-2.5 1.38,0 2.5,1.12 2.5,2.5 0,1.38 -1.12,2.5 -2.5,2.5 z',
    fillColor: colors[type] || '#757575',
    fillOpacity: isOperational ? 1 : 0.5,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: 1.5,
    anchor: new google.maps.Point(12, 22),
  };
};

const AccessMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<GoogleMapType | null>(null);
  const [activeTab, setActiveTab] = useState("route");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [infoWindow, setInfoWindow] = useState<InfoWindowType | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessibilityPoints, setAccessibilityPoints] = useState<AccessibilityPoint[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startLocation, setStartLocation] = useState('Current location');
  const [endLocation, setEndLocation] = useState('');
  const [preferences, setPreferences] = useState({
    wheelchairAccessible: false,
    avoidStairs: false,
    elevatorRequired: false,
    avoidConstruction: true
  });
  
  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      if (mapRef.current && !mapLoaded) {
        try {
          // Try to load Google Maps with a dummy API key - in production, use a real API key
          const loader = new Loader({
            apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your actual API key
            version: "weekly",
            libraries: ["places"]
          });
          
          const googleMaps = await loader.load();
          const map = new googleMaps.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 }, // Default to New York
            zoom: 14,
            mapTypeId: googleMaps.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
              position: googleMaps.maps.ControlPosition.RIGHT_TOP
            }
          });
          
          // Create a single info window instance to reuse
          const infoWindowInstance = new googleMaps.maps.InfoWindow();
          
          setMapInstance(map);
          setInfoWindow(infoWindowInstance);
          setMapLoaded(true);
          
          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                map.setCenter(pos);
                
                // Add a marker for the user's location
                new googleMaps.maps.Marker({
                  position: pos,
                  map: map,
                  icon: {
                    path: googleMaps.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                  },
                  title: "You are here",
                });
              },
              () => {
                console.log("Error: The Geolocation service failed.");
              }
            );
          }
          
        } catch (error) {
          console.error("Error loading Google Maps:", error);
          toast({
            title: "Error loading map",
            description: "Please check your internet connection and try again.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    initMap();
  }, [mapLoaded]);
  
  // Fetch accessibility data from Supabase
  useEffect(() => {
    const fetchAccessibilityData = async () => {
      try {
        // Fetch accessibility points
        const { data: pointsData, error: pointsError } = await supabase
          .from('accessibility_points')
          .select('*');
        
        if (pointsError) throw pointsError;
        
        // Fetch accessibility issues
        const { data: issuesData, error: issuesError } = await supabase
          .from('accessibility_issues')
          .select('*');
        
        if (issuesError) throw issuesError;
        
        // Cast the types properly to match our defined types
        setAccessibilityPoints(pointsData?.map(point => ({
          ...point,
          type: point.type as AccessibilityPointType,
          description: point.description || null,
        })) || []);
        
        setAccessibilityIssues(issuesData?.map(issue => ({
          ...issue,
          type: issue.type as AccessibilityIssueType,
          description: issue.description || null,
          end_date: issue.end_date || null,
        })) || []);
        
      } catch (error) {
        console.error("Error fetching accessibility data:", error);
        toast({
          title: "Error loading accessibility data",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    if (mapLoaded) {
      fetchAccessibilityData();
    }
  }, [mapLoaded]);
  
  // Add markers to the map when data is loaded
  useEffect(() => {
    if (mapInstance && infoWindow) {
      // Clear any existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers: MarkerType[] = [];
      
      // Add accessibility points
      accessibilityPoints.forEach(point => {
        if (window.google && mapInstance) {
          const marker = new window.google.maps.Marker({
            position: { lat: Number(point.latitude), lng: Number(point.longitude) },
            map: mapInstance,
            title: point.name,
            icon: getMarkerIcon(point.type, point.is_operational)
          });
          
          marker.addListener('click', () => {
            if (infoWindow) {
              const contentString = `
                <div class="p-2">
                  <h3 class="font-bold">${point.name}</h3>
                  <div class="text-sm mt-1">Type: ${point.type.replace('_', ' ')}</div>
                  ${point.description ? `<p class="text-sm mt-1">${point.description}</p>` : ''}
                  <div class="text-sm mt-1">Status: ${point.is_operational ? 'Operational' : 'Not operational'}</div>
                  ${point.verified ? '<div class="text-sm text-green-600 mt-1">✓ Verified</div>' : ''}
                </div>
              `;
              
              infoWindow.setContent(contentString);
              infoWindow.open(mapInstance, marker);
            }
          });
          
          newMarkers.push(marker);
        }
      });
      
      // Add accessibility issues
      accessibilityIssues.forEach(issue => {
        if (window.google && mapInstance) {
          const marker = new window.google.maps.Marker({
            position: { lat: Number(issue.latitude), lng: Number(issue.longitude) },
            map: mapInstance,
            title: issue.title,
            icon: getMarkerIcon(issue.type)
          });
          
          marker.addListener('click', () => {
            if (infoWindow) {
              const endDateText = issue.end_date 
                ? `Expected to end: ${new Date(issue.end_date).toLocaleDateString()}`
                : 'End date: Unknown';
              
              const contentString = `
                <div class="p-2">
                  <h3 class="font-bold">${issue.title}</h3>
                  <div class="text-sm mt-1">Type: ${issue.type.replace('_', ' ')}</div>
                  ${issue.description ? `<p class="text-sm mt-1">${issue.description}</p>` : ''}
                  <div class="text-sm mt-1">Started: ${new Date(issue.start_date).toLocaleDateString()}</div>
                  <div class="text-sm mt-1">${endDateText}</div>
                  ${issue.verified ? '<div class="text-sm text-green-600 mt-1">✓ Verified</div>' : ''}
                </div>
              `;
              
              infoWindow.setContent(contentString);
              infoWindow.open(mapInstance, marker);
            }
          });
          
          newMarkers.push(marker);
        }
      });
      
      setMarkers(newMarkers);
    }
  }, [mapInstance, infoWindow, accessibilityPoints, accessibilityIssues]);
  
  const handleSearchPlaces = useCallback(() => {
    if (!mapInstance || !searchQuery) return;
    
    // Filter points based on search query
    const filteredPoints = accessibilityPoints.filter(point => 
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // If we found matching points, zoom to them
    if (filteredPoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredPoints.forEach(point => {
        bounds.extend({ lat: Number(point.latitude), lng: Number(point.longitude) });
      });
      mapInstance.fitBounds(bounds);
      
      // If only one point, zoom in more
      if (filteredPoints.length === 1) {
        mapInstance.setZoom(18);
      }
      
      toast({
        title: `Found ${filteredPoints.length} matching locations`,
        description: "The map has been centered on the results."
      });
    } else {
      toast({
        title: "No matching locations found",
        description: "Try a different search term."
      });
    }
  }, [mapInstance, searchQuery, accessibilityPoints]);
  
  const handleFindRoute = useCallback(() => {
    // In a real app, this would connect to a routing API with accessibility preferences
    // For now, we'll just show a toast
    toast({
      title: "Route planning",
      description: "This feature will be implemented soon. It will include your accessibility preferences.",
    });
  }, [preferences]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const togglePreference = (preference: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
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
        {loading && (
          <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-accessBlue" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
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
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
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
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Accessibility Preferences</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="wheelchair-required" 
                    checked={preferences.wheelchairAccessible}
                    onCheckedChange={() => togglePreference('wheelchairAccessible')}
                  />
                  <Label htmlFor="wheelchair-required" className="flex items-center">
                    <Accessibility className="h-4 w-4 mr-2 text-accessBlue" />
                    Wheelchair accessible
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="avoid-stairs"
                    checked={preferences.avoidStairs}
                    onCheckedChange={() => togglePreference('avoidStairs')}
                  />
                  <Label htmlFor="avoid-stairs" className="flex items-center">
                    <Stars className="h-4 w-4 mr-2 text-accessOrange" />
                    Avoid stairs
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="elevator-required"
                    checked={preferences.elevatorRequired}
                    onCheckedChange={() => togglePreference('elevatorRequired')}
                  />
                  <Label htmlFor="elevator-required" className="flex items-center">
                    <ArrowUp className="h-4 w-4 mr-2 text-accessBlue" />
                    Elevator required
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="avoid-construction" 
                    checked={preferences.avoidConstruction}
                    onCheckedChange={() => togglePreference('avoidConstruction')}
                  />
                  <Label htmlFor="avoid-construction" className="flex items-center">
                    <Construction className="h-4 w-4 mr-2 text-accessOrange" />
                    Avoid construction
                  </Label>
                </div>
              </div>
            </div>
            
            <Button className="w-full" onClick={handleFindRoute}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPlaces()}
              />
              <Button 
                className="absolute right-1 top-1 h-8" 
                size="sm"
                onClick={handleSearchPlaces}
              >
                Search
              </Button>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium">Nearby Accessible Places</h3>
              <p className="text-sm text-gray-600">Explore wheelchair accessible locations in this area</p>
            </div>
            
            <div className="space-y-3">
              {accessibilityPoints.length > 0 ? (
                accessibilityPoints.slice(0, 5).map((point) => (
                  <div 
                    key={point.id}
                    className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer"
                    onClick={() => {
                      if (mapInstance) {
                        mapInstance.setCenter({ 
                          lat: Number(point.latitude), 
                          lng: Number(point.longitude) 
                        });
                        mapInstance.setZoom(18);
                      }
                    }}
                  >
                    <h4 className="font-medium">{point.name}</h4>
                    <div className="flex space-x-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Accessibility className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                        {point.type.replace('_', ' ')}
                      </span>
                      {point.type === 'elevator' && (
                        <span className="flex items-center">
                          <ArrowUp className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                          Elevator
                        </span>
                      )}
                    </div>
                    {point.description && (
                      <p className="text-sm text-gray-600">{point.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No accessibility points found nearby.</p>
                  <p className="text-sm text-gray-400 mt-1">Try searching in a different area or contribute by adding points!</p>
                </div>
              )}
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
