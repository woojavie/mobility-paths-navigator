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

    // Initialize the Routes API client
    const routesService = new google.maps.RoutesService();

    const request = {
      origin: {
        location: {
          latLng: {
            latitude: originCoords.lat,
            longitude: originCoords.lng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destinationCoords.lat,
            longitude: destinationCoords.lng
          }
        }
      },
      travelMode: google.maps.TravelMode.WALKING,
      routingPreference: google.maps.RoutingPreference.LESS_WALKING,
      languageCode: "en-US",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidIndoor: preferences.avoidStairs,
        avoidElevators: !preferences.elevatorRequired,
      }
    };

    const response = await routesService.route(request);
    
    if (!response || !response.routes || response.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = response.routes[0];
    const leg = route.legs[0];

    return {
      steps: leg.steps.map(step => ({
        instructions: step.navigationInstruction.instructions,
        distance: formatDistance(step.distanceMeters),
        duration: formatDuration(step.duration)
      })),
      totalDistance: formatDistance(route.distanceMeters),
      totalDuration: formatDuration(route.duration),
      polyline: route.polyline.encodedPolyline
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
  const totalSeconds = parseInt(seconds.replace('s', ''));
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 1) {
    return '1 min';
  }
  return `${minutes} min`;
}; 