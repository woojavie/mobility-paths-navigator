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

// export const calculateRoute = async (
//   origin: LatLng | string,
//   destination: LatLng | string,
//   preferences: RoutePreferences
// ): Promise<RouteResult | null> => {
//   try {
//     if (!window.google) {
//       throw new Error('Google Maps not loaded');
//     }

//     console.log('Starting route calculation...');
//     console.log('Origin:', origin);
//     console.log('Destination:', destination);

//     // Convert string addresses to coordinates if needed
//     const originCoords = typeof origin === 'string' 
//       ? await geocodeAddress(origin)
//       : origin;
    
//     const destinationCoords = typeof destination === 'string'
//       ? await geocodeAddress(destination)
//       : destination;

//     if (!originCoords || !destinationCoords) {
//       throw new Error('Could not find location coordinates');
//     }

//     console.log('Coordinates resolved:', { originCoords, destinationCoords });

//     // Calculate straight-line distance
//     const distanceInMeters = calculateDistance(originCoords, destinationCoords);
    
//     // Assume average walking speed of 1.4 meters per second (5 km/h)
//     const durationInSeconds = Math.ceil(distanceInMeters / 1.4);

//     // Create a simple path with just the start and end points
//     const path = [originCoords, destinationCoords];

//     // Create a single step for the route
//     const steps: RouteStep[] = [{
//       instructions: `Walk to destination`,
//       distance: formatDistance(distanceInMeters),
//       duration: formatDuration(durationInSeconds.toString())
//     }];

//     // Add accessibility warning if needed
//     if (preferences.wheelchairAccessible || preferences.avoidStairs) {
//       steps[0].instructions = '⚠️ Note: This is a direct route and may not account for accessibility barriers. Please verify the path is accessible.';
//     }

//     return {
//       steps,
//       totalDistance: formatDistance(distanceInMeters),
//       totalDuration: formatDuration(durationInSeconds.toString()),
//       path
//     };

//   } catch (error) {
//     console.error('Error calculating route:', error);
    
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     toast({
//       title: "Error calculating route",
//       description: errorMessage,
//       variant: "destructive"
//     });
//     return null;
//   }
// };

export const calculateRoute = async (
  origin: LatLng | string,
  destination: LatLng | string,
  preferences: RoutePreferences
): Promise<RouteResult | null> => {
  try {
    if (!window.google || !google.maps.DirectionsService) {
      throw new Error('Google Maps API not loaded');
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

    // Initialize Google Maps Directions Service
    const directionsService = new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: originCoords,
      destination: destinationCoords,
      travelMode: google.maps.TravelMode.WALKING,
    };

    const response = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error('Directions request failed with status: ' + status));
        }
      });
    });

    // Extract steps and path from response
    const route = response.routes[0].legs[0];
    const steps: RouteStep[] = route.steps.map(step => ({
      instructions: step.instructions,
      distance: step.distance.text,
      duration: step.duration.text,
    }));

    const path: LatLng[] = route.steps.flatMap(step => step.path.map(p => ({ lat: p.lat(), lng: p.lng() })));

    return {
      steps,
      totalDistance: route.distance.text,
      totalDuration: route.duration.text,
      path,
    };

  } catch (error) {
    console.error('Error calculating route:', error);
    
    toast({
      title: "Error calculating route",
      description: error instanceof Error ? error.message : "Unknown error",
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