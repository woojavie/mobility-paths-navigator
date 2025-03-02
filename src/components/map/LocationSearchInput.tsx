import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface LocationSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

declare global {
  interface Window {
    initMapCallback?: () => void;
    google: any;
  }
}

const LocationSearchInput = ({
  placeholder,
  value,
  onChange,
  className = '',
  onPlaceSelected
}: LocationSearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Function to get user's current location
  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  // Function to initialize the autocomplete
  const initAutocomplete = async () => {
    if (!inputRef.current || !window.google) return;
    
    try {
      setIsLocating(true);
      const location = await getUserLocation();
      setUserLocation(location);
      
      const options: google.maps.places.AutocompleteOptions = {
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        types: ['establishment', 'geocode'],
      };

      // If we have user's location, set the search bias
      if (location) {
        const circle = new google.maps.Circle({
          center: location,
          radius: 50000 // 50km radius
        });
        options.bounds = circle.getBounds() as google.maps.LatLngBounds;
        options.strictBounds = false; // Allow results outside the bounds
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);
      
      // Apply custom styles to match the app's UI
      const container = inputRef.current.parentElement;
      const pacContainer = container?.querySelector('.pac-container');
      if (pacContainer) {
        pacContainer.classList.add(
          'shadow-lg',
          'rounded-lg',
          'border',
          'border-gray-200',
          'bg-white',
          'mt-1'
        );
      }

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address || place.name) {
          onChange(place.formatted_address || place.name);
          onPlaceSelected && onPlaceSelected(place);
        }
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    } finally {
      setIsLocating(false);
    }
  };
  
  useEffect(() => {
    // If Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
      setIsLoaded(true);
      return;
    }
    
    // If the API is still loading, set a callback
    window.initMapCallback = () => {
      initAutocomplete();
      setIsLoaded(true);
    };
    
    // Clean up
    return () => {
      window.initMapCallback = undefined;
    };
  }, []);

  // Add custom styles for the autocomplete dropdown
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .pac-container {
        border-radius: 0.5rem;
        margin-top: 0.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #e5e7eb;
        background-color: white;
        z-index: 1000;
      }
      .pac-item {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #374151;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .pac-item:hover {
        background-color: #f3f4f6;
      }
      .pac-item-selected {
        background-color: #f3f4f6;
      }
      .pac-icon {
        display: none;
      }
      .pac-item-query {
        font-size: 0.875rem;
        color: #111827;
        font-weight: 500;
        margin-right: 0.5rem;
      }
      .pac-matched {
        font-weight: 600;
        color: #2563eb;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {isLocating ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 h-12 shadow-sm border-0 bg-white focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
        aria-label={placeholder}
      />
    </div>
  );
};

export default LocationSearchInput; 