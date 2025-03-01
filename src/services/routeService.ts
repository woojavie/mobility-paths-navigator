import { toast } from "@/components/ui/use-toast";

interface LatLng {
  lat: number;
  lng: number;
}

interface RoutePreferences {
  wheelchairAccessible: boolean;
  avoidStairs: boolean;
  elevatorRequired: boolean;
  avoidConstruction: boolean;
}

export interface RouteStep {
  instructions: string;
  distance: string;
  duration: string;
}

export interface RouteResult {
  steps: RouteStep[];
  totalDistance: string;
  totalDuration: string;
  polyline: string;
}

export const calculateRoute = async (
  origin: LatLng | string,
  destination: LatLng | string,
  preferences: RoutePreferences
): Promise<RouteResult | null> => {
  try {
    if (!window.google) {
      throw new Error('Google Maps not loaded');
    }

    const directionsService = new google.maps.DirectionsService();

    // Convert string addresses to coordinates if needed
    const originCoords = typeof origin === 'string' 
      ? await geocodeAddress(origin)
      : origin;
    
    const destinationCoords = typeof destination === 'string'
      ? await geocodeAddress(destination)
      : destination;

    if (!originCoords || !destinationCoords) {
      throw new Error('Could not find location coordinates');
    }

    const request: google.maps.DirectionsRequest = {
      origin: originCoords,
      destination: destinationCoords,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: false,
    };

    const result = await directionsService.route(request);
    const route = result.routes[0];
    const leg = route.legs[0];

    if (!leg) {
      throw new Error('No route found');
    }

    // Create encoded polyline from route path
    const path = route.overview_path;
    const polyline = google.maps.geometry.encoding.encodePath(path);

    return {
      steps: leg.steps.map(step => ({
        instructions: step.instructions,
        distance: step.distance?.text || '0 m',
        duration: step.duration?.text || '1 min'
      })),
      totalDistance: leg.distance?.text || '0 km',
      totalDuration: leg.duration?.text || '0 min',
      polyline
    };

  } catch (error) {
    console.error('Error calculating route:', error);
    toast({
      title: "Error calculating route",
      description: error instanceof Error ? error.message : "Please try again",
      variant: "destructive"
    });
    return null;
  }
};

const geocodeAddress = async (address: string): Promise<LatLng | null> => {
  try {
    if (!window.google) {
      throw new Error('Google Maps not loaded');
    }

    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ address });

    if (result.results && result.results[0]) {
      const location = result.results[0].geometry.location;
      return {
        lat: location.lat(),
        lng: location.lng()
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

const formatDistance = (meters: number): string => {
  const miles = meters * 0.000621371;
  if (miles < 0.1) {
    return `${Math.round(meters)} meters`;
  }
  return `${miles.toFixed(1)} miles`;
};

const formatDuration = (seconds: string): string => {
  const totalSeconds = parseInt(seconds.replace('s', ''));
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 1) {
    return '1 min';
  }
  return `${minutes} min`;
}; 