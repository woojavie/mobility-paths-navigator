import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, Layers, Navigation } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

type MapControlsProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  mapInstance: google.maps.Map | null;
  setStartLocation?: (location: string) => void;
};

const MapControls = ({ isSidebarOpen, toggleSidebar, mapInstance, setStartLocation }: MapControlsProps) => {
  const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = async () => {
    if (!mapInstance) return;
    
    setIsLocating(true);

    try {
      // Clear existing marker if any
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
      }

      const position = await getCurrentPosition();
      mapInstance.setCenter(position);
      mapInstance.setZoom(17);

      // Create a stationary dot marker for current location
      const marker = new google.maps.Marker({
        position,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#2563EB',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          strokeOpacity: 1
        },
        title: 'Your Location'
      });

      setCurrentLocationMarker(marker);

      // Reverse geocode the coordinates to get the address
      const geocoder = new google.maps.Geocoder();
      const results = await geocoder.geocode({ location: position });
      
      if (results.results[0] && setStartLocation) {
        const address = results.results[0].formatted_address;
        setStartLocation(address);
      }

      toast({
        title: "Location Found",
        description: "Map centered on your current location",
      });
    } catch (error) {
      console.error('Location error:', error);
      
      // Provide more specific error messages based on the error code
      let errorMessage = "Could not get your current location. ";
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access in your browser settings. Click the location icon in your address bar and select 'Allow'.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable. Please try again or check if your device's GPS is enabled.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please check your internet connection and try again.";
            break;
          default:
            errorMessage += "Please check your browser settings and try again.";
        }
      }

      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
        duration: 7000
      });
    } finally {
      setIsLocating(false);
    }
  };

  const getCurrentPosition = (): Promise<google.maps.LatLngLiteral> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
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
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  return (
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
        className={`rounded-full glass-morphism shadow-button hover:bg-accessBlue hover:text-white transition-colors ${
          isLocating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="My location"
        onClick={handleCurrentLocation}
        disabled={isLocating}
      >
        <Navigation className={`h-5 w-5 ${isLocating ? 'animate-pulse' : ''}`} />
      </Button>
    </div>
  );
};

export default MapControls;
