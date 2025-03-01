
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
  
  const togglePreference = (preference: keyof PreferencesType) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };
  
  return (
    <div className="h-screen w-full flex relative">
      {/* Map Controls */}
      <MapControls isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Map Container */}
      <div ref={mapRef} className="flex-1 h-full bg-gray-100">
        {loading && <MapLoading />}
      </div>
      
      {/* Sidebar */}
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
    </div>
  );
};

export default AccessMap;
