import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, Layers, Navigation } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type MapControlsProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  mapInstance: google.maps.Map | null;
};

const MapControls = ({ isSidebarOpen, toggleSidebar, mapInstance }: MapControlsProps) => {
  const handleCurrentLocation = async () => {
    if (!mapInstance) return;

    try {
      const position = await getCurrentPosition();
      mapInstance.setCenter(position);
      mapInstance.setZoom(17);

      // Create a pulsing dot marker for current location
      new google.maps.Marker({
        position,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#2563EB',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        animation: google.maps.Animation.BOUNCE,
        title: 'Your Location'
      });

      toast({
        title: "Location Found",
        description: "Map centered on your current location",
      });
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Could not get your current location. Please check your browser settings.",
        variant: "destructive"
      });
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
          timeout: 5000,
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
        className="rounded-full glass-morphism shadow-button hover:bg-accessBlue hover:text-white transition-colors"
        aria-label="My location"
        onClick={handleCurrentLocation}
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapControls;
