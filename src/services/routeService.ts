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
  path: LatLng[];
}

// Calculate distance between two points using the Haversine formula
const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const calculateRoute = async (
  origin: LatLng | string,
  destination: LatLng | string,
  preferences: RoutePreferences
): Promise<RouteResult | null> => {
  try {
    if (!window.google) {
      throw new Error('Google Maps not loaded');
    }

    console.log('Starting route calculation...');
    console.log('Origin:', origin);
    console.log('Destination:', destination);

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

    console.log('Coordinates resolved:', { originCoords, destinationCoords });

    // Calculate straight-line distance
    const distanceInMeters = calculateDistance(originCoords, destinationCoords);
    
    // Assume average walking speed of 1.4 meters per second (5 km/h)
    const durationInSeconds = Math.ceil(distanceInMeters / 1.4);

    // Create a simple path with just the start and end points
    const path = [originCoords, destinationCoords];

    // Create a single step for the route
    const steps: RouteStep[] = [{
      instructions: `Walk to destination`,
      distance: formatDistance(distanceInMeters),
      duration: formatDuration(durationInSeconds.toString())
    }];

    // Add accessibility warning if needed
    if (preferences.wheelchairAccessible || preferences.avoidStairs) {
      steps[0].instructions = '⚠️ Note: This is a direct route and may not account for accessibility barriers. Please verify the path is accessible.';
    }

    return {
      steps,
      totalDistance: formatDistance(distanceInMeters),
      totalDuration: formatDuration(durationInSeconds.toString()),
      path
    };

  } catch (error) {
    console.error('Error calculating route:', error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast({
      title: "Error calculating route",
      description: errorMessage,
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
  const totalSeconds = parseInt(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 1) {
    return '1 min';
  }
  return `${minutes} min`;
}; 