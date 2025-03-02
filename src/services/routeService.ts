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

interface RouteLeg {
  steps?: Array<{
    navigationInstruction?: {
      instructions: string;
    };
  }>;
  distanceMeters: number;
  duration: string;
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

const ROUTES_API_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes';

export const calculateRoute = async (
  origin: LatLng | string,
  destination: LatLng | string,
  preferences: RoutePreferences
): Promise<RouteResult | null> => {
  try {
    if (!window.google) {
      throw new Error('Google Maps not loaded');
    }

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

    // Use DirectionsService instead of Routes API
    const directionsService = new google.maps.DirectionsService();
    
    const request: google.maps.DirectionsRequest = {
      origin: originCoords,
      destination: destinationCoords,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: false
    };

    // Add accessibility preferences
    if (preferences.wheelchairAccessible) {
      request.optimizeWaypoints = true;
    }

    try {
      console.log('Sending directions request:', request);
      const response = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          console.log('DirectionsService response:', { status, result });
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
            reject(new Error('No route found between these locations'));
          } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            reject(new Error('Too many requests. Please try again later'));
          } else if (status === google.maps.DirectionsStatus.REQUEST_DENIED) {
            reject(new Error('Request denied. Please check if the Directions API is enabled in your Google Cloud Console'));
          } else {
            reject(new Error(`Failed to calculate route: ${status}`));
          }
        });
      });

      const route = response.routes[0];
      const leg = route.legs[0];

      if (!leg) {
        throw new Error('No route found');
      }

      // Convert the route steps into our format
      const steps: RouteStep[] = leg.steps.map(step => ({
        instructions: step.instructions,
        distance: step.distance.text,
        duration: step.duration.text
      }));

      // Add accessibility warning if needed
      if (preferences.wheelchairAccessible) {
        steps.unshift({
          instructions: '⚠️ Please verify that this route is wheelchair accessible. Some obstacles may not be detected.',
          distance: '',
          duration: ''
        });
      }

      // Extract path coordinates
      const path: LatLng[] = leg.steps.flatMap(step => 
        step.path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }))
      );

      return {
        steps,
        totalDistance: leg.distance.text,
        totalDuration: leg.duration.text,
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

    // Validate address string
    if (!address || typeof address !== 'string' || address.trim() === '') {
      throw new Error('Invalid address provided');
    }

    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ address: address.trim() });

    if (!result || !result.results || !result.results[0]) {
      throw new Error('No results found for the provided address');
    }

    const location = result.results[0].geometry.location;
    if (!location || typeof location.lat !== 'function' || typeof location.lng !== 'function') {
      throw new Error('Invalid location data received from geocoder');
    }

    return {
      lat: location.lat(),
      lng: location.lng()
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    toast({
      title: "Geocoding error",
      description: error instanceof Error ? error.message : "Could not find the location",
      variant: "destructive"
    });
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