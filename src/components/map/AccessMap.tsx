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
import { ContributionDialog } from './ContributionDialog';
import { Plus, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add type for origin
type OriginType = google.maps.LatLng | string;

type Coordinates = {
  lat: number;
  lng: number;
};

interface AccessMapProps {
  initialStartLocation?: string;
  initialDestination?: string;
  initialPreferences?: PreferencesType;
}

const AccessMap = ({ 
  initialStartLocation, 
  initialDestination,
  initialPreferences 
}: AccessMapProps) => {
  const { mapRef, mapInstance, infoWindow, mapLoaded, loading } = useGoogleMaps();
  const [activeTab, setActiveTab] = useState("route");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [accessibilityPoints, setAccessibilityPoints] = useState<AccessibilityPoint[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startLocation, setStartLocation] = useState(initialStartLocation || 'Current location');
  const [endLocation, setEndLocation] = useState(initialDestination || '');
  const [preferences, setPreferences] = useState<PreferencesType>(initialPreferences || {
    wheelchairAccessible: false,
    avoidStairs: false,
    elevatorRequired: false,
    avoidConstruction: true
  });
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);
  const [contributionDialog, setContributionDialog] = useState<{
    isOpen: boolean;
    type: 'point' | 'issue';
    location: { lat: number; lng: number } | null;
  }>({
    isOpen: false,
    type: 'point',
    location: null
  });

  // Extract fetchAccessibilityData to be reusable
  const fetchAccessibilityData = async () => {
    try {
      // Fetch accessibility points
      const { data: pointsData, error: pointsError } = await supabase
        .from('accessibility_points')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pointsError) throw pointsError;
      
      // Fetch accessibility issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('accessibility_issues')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (issuesError) throw issuesError;
      
      // Cast the types properly to match our defined types
      setAccessibilityPoints(pointsData?.map(point => ({
        id: point.id,
        type: point.type as AccessibilityPointType,
        name: point.name,
        description: point.description || null,
        latitude: point.latitude,
        longitude: point.longitude,
        is_operational: point.is_operational,
        verified: point.verified || null,
        upvotes: point.upvotes || null,
        created_at: point.created_at || null,
        updated_at: point.updated_at || null,
        author_id: point.reported_by
      })) || []);
      
      setAccessibilityIssues(issuesData?.map(issue => ({
        id: issue.id,
        type: issue.type as AccessibilityIssueType,
        title: issue.title,
        description: issue.description || null,
        latitude: issue.latitude,
        longitude: issue.longitude,
        start_date: issue.start_date || null,
        end_date: issue.end_date || null,
        verified: issue.verified || null,
        upvotes: issue.upvotes || null,
        created_at: issue.created_at || null,
        updated_at: issue.updated_at || null,
        author_id: issue.reported_by
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
  
  // Fetch accessibility data from Supabase
  useEffect(() => {
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

      let origin: string | Coordinates;
      try {
        origin = startLocation === 'Current location'
          ? await getCurrentPosition()
          : startLocation.trim();
      } catch (error) {
        toast({
          title: "Location error",
          description: "Could not get current location. Please enter a start location manually.",
          variant: "destructive"
        });
        return;
      }

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

  const getCurrentPosition = (): Promise<Coordinates> => {
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
  
  // Add click handler for map
  useEffect(() => {
    if (mapInstance) {
      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        const position = e.latLng;
        if (position) {
          const location = {
            lat: position.lat(),
            lng: position.lng()
          };
          setContributionDialog(prev => ({
            ...prev,
            location
          }));
        }
      });
    }
  }, [mapInstance]);

  // Add function to open contribution dialog
  const openContributionDialog = (type: 'point' | 'issue') => {
    if (!contributionDialog.location) {
      toast({
        title: "Select location",
        description: "Click on the map to select a location first.",
        variant: "destructive"
      });
      return;
    }
    setContributionDialog(prev => ({
      ...prev,
      isOpen: true,
      type
    }));
  };

  // Add function to close contribution dialog
  const closeContributionDialog = () => {
    setContributionDialog({
      isOpen: false,
      type: 'point',
      location: null
    });
  };

  // Add real-time subscription for points and issues
  useEffect(() => {
    if (!mapLoaded) return;

    // Subscribe to accessibility points changes
    const pointsSubscription = supabase
      .channel('accessibility_points_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accessibility_points'
        },
        () => {
          // Refresh points data
          fetchAccessibilityData();
        }
      )
      .subscribe();

    // Subscribe to accessibility issues changes
    const issuesSubscription = supabase
      .channel('accessibility_issues_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accessibility_issues'
        },
        () => {
          // Refresh issues data
          fetchAccessibilityData();
        }
      )
      .subscribe();

    return () => {
      pointsSubscription.unsubscribe();
      issuesSubscription.unsubscribe();
    };
  }, [mapLoaded]);

  // Handle point click from community tab
  const handlePointClick = useCallback((point: AccessibilityPoint) => {
    if (mapInstance && infoWindow) {
      const contentString = createAccessibilityPointInfoContent(point);
      infoWindow.setContent(contentString);
      infoWindow.setPosition({ lat: Number(point.latitude), lng: Number(point.longitude) });
      infoWindow.open(mapInstance);
    }
  }, [mapInstance, infoWindow]);

  // Handle issue click from community tab
  const handleIssueClick = useCallback((issue: AccessibilityIssue) => {
    if (mapInstance && infoWindow) {
      const contentString = createAccessibilityIssueInfoContent(issue);
      infoWindow.setContent(contentString);
      infoWindow.setPosition({ lat: Number(issue.latitude), lng: Number(issue.longitude) });
      infoWindow.open(mapInstance);
    }
  }, [mapInstance, infoWindow]);

  // Calculate route when initial parameters are provided
  useEffect(() => {
    if (mapLoaded && initialStartLocation && initialDestination) {
      calculateAndDisplayRoute();
    }
  }, [mapLoaded, initialStartLocation, initialDestination]);

  return (
    <div className="h-screen w-full flex relative overflow-hidden">
      {/* Map Controls */}
      <MapControls 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        mapInstance={mapInstance}
      />
      
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="h-full w-full" />
        
        {loading && <MapLoading />}
        
        {mapLoaded && (
          <>
            <MapControls
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              mapInstance={mapInstance}
              onAddPoint={() => openContributionDialog('point')}
              onReportIssue={() => openContributionDialog('issue')}
            />
            
            <ContributionDialog
              isOpen={contributionDialog.isOpen}
              onClose={closeContributionDialog}
              onSuccess={fetchAccessibilityData}
              type={contributionDialog.type}
              location={contributionDialog.location}
            />
            
            {currentRoute && (
              <DirectionsPanel
                steps={currentRoute.steps}
                totalDistance={currentRoute.totalDistance}
                totalDuration={currentRoute.totalDuration}
                onBack={() => {
                  setCurrentRoute(null);
                  if (routePolyline) {
                    routePolyline.setMap(null);
                    setRoutePolyline(null);
                  }
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchPlaces={handleSearchPlaces}
        startLocation={startLocation}
        setStartLocation={setStartLocation}
        endLocation={endLocation}
        setEndLocation={setEndLocation}
        preferences={preferences}
        togglePreference={togglePreference}
        handleFindRoute={calculateAndDisplayRoute}
        accessibilityPoints={accessibilityPoints}
        accessibilityIssues={accessibilityIssues}
        mapInstance={mapInstance}
        onPointClick={handlePointClick}
        onIssueClick={handleIssueClick}
        onPointsUpdate={fetchAccessibilityData}
        onIssuesUpdate={fetchAccessibilityData}
      />
    </div>
  );
};

export default AccessMap;

