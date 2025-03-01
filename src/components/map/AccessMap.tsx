import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  AccessibilityPoint, 
  AccessibilityIssue,
  AccessibilityPointType,
  AccessibilityIssueType,
  MarkerType,
  PreferencesType
} from './types';
import { getMarkerIcon, createAccessibilityPointInfoContent, createAccessibilityIssueInfoContent } from './mapUtils';
import { useGoogleMaps } from './useGoogleMaps';
import MapControls from './MapControls';
import MapLoading from './MapLoading';
import Sidebar from './Sidebar';
import { calculateRoute, RouteResult } from '@/services/routeService';
import DirectionsPanel from './DirectionsPanel';

const AccessMap = () => {
  const { mapRef, mapInstance, infoWindow, mapLoaded, loading } = useGoogleMaps();
  const [activeTab, setActiveTab] = useState("route");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [accessibilityPoints, setAccessibilityPoints] = useState<AccessibilityPoint[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startLocation, setStartLocation] = useState('Current location');
  const [endLocation, setEndLocation] = useState('');
  const [preferences, setPreferences] = useState<PreferencesType>({
    wheelchairAccessible: false,
    avoidStairs: false,
    elevatorRequired: false,
    avoidConstruction: true
  });
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);
  
  // Fetch accessibility data from Supabase
  useEffect(() => {
    const fetchAccessibilityData = async () => {
      try {
        console.log('Fetching accessibility data from Supabase...');
        
        // Fetch accessibility points
        const pointsQuery = supabase.from('accessibility_points').select('*');
        console.log('Executing points query:', pointsQuery);
        const { data: pointsData, error: pointsError } = await pointsQuery;
        
        if (pointsError) {
          console.error('Error fetching accessibility points:', pointsError);
          throw pointsError;
        }
        
        console.log('Received points data:', pointsData);
        
        // Fetch accessibility issues
        const issuesQuery = supabase.from('accessibility_issues').select('*');
        console.log('Executing issues query:', issuesQuery);
        const { data: issuesData, error: issuesError } = await issuesQuery;
        
        if (issuesError) {
          console.error('Error fetching accessibility issues:', issuesError);
          throw issuesError;
        }
        
        console.log('Received issues data:', issuesData);
        
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
        console.error("Error details:", {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        toast({
          title: "Error loading accessibility data",
          description: "Please check the console for details and try again later.",
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
              const contentString = createAccessibilityPointInfoContent(point);
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
              const contentString = createAccessibilityIssueInfoContent(issue);
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
  
  const calculateAndDisplayRoute = useCallback(async () => {
    if (!mapInstance || !startLocation || !endLocation) return;

    try {
      let originCoords: { lat: number; lng: number } | string;
      
      // Handle current location
      if (startLocation === 'Current location') {
        try {
          originCoords = await getCurrentPosition();
          // Center map on current location
          mapInstance.setCenter(originCoords);
          mapInstance.setZoom(15);
        } catch (error) {
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please check your browser settings.",
            variant: "destructive"
          });
          return;
        }
      } else {
        originCoords = startLocation;
      }

      // Clear existing route if any
      if (routePolyline) {
        routePolyline.setMap(null);
        setRoutePolyline(null);
      }
      setCurrentRoute(null);

      const route = await calculateRoute(originCoords, endLocation, preferences);
      
      if (route) {
        // Create and display the route polyline using the path points
        const newPolyline = new google.maps.Polyline({
          path: route.path,
          geodesic: true,
          strokeColor: '#2563eb',
          strokeOpacity: 1.0,
          strokeWeight: 3,
        });
        
        newPolyline.setMap(mapInstance);
        setRoutePolyline(newPolyline);
        setCurrentRoute(route);

        // Fit bounds to show the entire route
        const bounds = new google.maps.LatLngBounds();
        route.path.forEach((point) => bounds.extend(point));
        mapInstance.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      toast({
        title: "Route Error",
        description: "Could not calculate the route. Please try again.",
        variant: "destructive"
      });
    }
  }, [mapInstance, startLocation, endLocation, preferences]);

  const handleFindRoute = useCallback(async () => {
    if (!mapInstance || !startLocation || !endLocation) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and end locations.",
        variant: "destructive"
      });
      return;
    }

    await calculateAndDisplayRoute();
  }, [mapInstance, startLocation, endLocation, calculateAndDisplayRoute]);

  const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(new Error('Could not get current location'));
        }
      );
    });
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const togglePreference = (preference: keyof PreferencesType) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleBackFromDirections = useCallback(() => {
    if (routePolyline) {
      routePolyline.setMap(null);
      setRoutePolyline(null);
    }
    setCurrentRoute(null);
  }, [routePolyline]);
  
  return (
    <div className="h-screen w-full flex relative overflow-hidden">
      {/* Map Controls */}
      <MapControls isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="absolute inset-0 bg-gray-100"
        />
        {loading && <MapLoading />}
      </div>
      
      {/* Sidebar */}
      <div 
        className={`bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-full md:w-96' : 'w-0 overflow-hidden'
        }`}
      >
        {currentRoute ? (
          <DirectionsPanel
            steps={currentRoute.steps}
            totalDistance={currentRoute.totalDistance}
            totalDuration={currentRoute.totalDuration}
            onBack={handleBackFromDirections}
          />
        ) : (
          <Sidebar 
            isSidebarOpen={isSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            startLocation={startLocation}
            setStartLocation={setStartLocation}
            endLocation={endLocation}
            setEndLocation={setEndLocation}
            preferences={preferences}
            togglePreference={togglePreference}
            handleFindRoute={handleFindRoute}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchPlaces={handleSearchPlaces}
            accessibilityPoints={accessibilityPoints}
            mapInstance={mapInstance}
          />
        )}
      </div>
    </div>
  );
};

export default AccessMap;

