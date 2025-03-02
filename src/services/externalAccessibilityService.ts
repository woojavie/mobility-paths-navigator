import { AccessibilityPoint, AccessibilityPointType } from '@/components/map/types';
import { toast } from '@/components/ui/use-toast';

// Types for OpenStreetMap data
interface OSMNode {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    'wheelchair'?: 'yes' | 'limited' | 'no' | 'unknown';
    'wheelchair:description'?: string;
    'amenity'?: string;
    'highway'?: string;
    'access'?: string;
    'tactile_paving'?: 'yes' | 'no';
    'handrail'?: 'yes' | 'no';
    'door'?: string;
    'automatic_door'?: 'yes' | 'no';
    'building'?: string;
    'shop'?: string;
    'healthcare'?: string;
    'leisure'?: string;
  };
}

interface OverpassResponse {
  elements: OSMNode[];
}

// Convert OSM wheelchair status to operational status
const isWheelchairAccessible = (status?: string): boolean => {
  return status === 'yes' || status === 'limited';
};

// Determine accessibility point type from OSM tags
const getAccessibilityType = (tags: OSMNode['tags']): AccessibilityPointType => {
  // Check for accessible bathrooms first
  if (tags.amenity === 'toilets' && isWheelchairAccessible(tags.wheelchair)) {
    return 'accessible_bathroom';
  }
  
  // Check for elevators
  if (tags.highway === 'elevator' || tags.amenity === 'elevator') {
    return 'elevator';
  }
  
  // Check for ramps
  if (
    tags.highway === 'ramp' || 
    tags['wheelchair:description']?.toLowerCase().includes('ramp')
  ) {
    return 'ramp';
  }

  // Check for accessible entrances with automatic doors
  if (tags.automatic_door === 'yes' && isWheelchairAccessible(tags.wheelchair)) {
    return 'accessible_entrance';
  }

  // Default to accessible entrance for any wheelchair accessible location
  return 'accessible_entrance';
};

// Convert OSM node to our AccessibilityPoint format
const convertOSMNode = (node: OSMNode): AccessibilityPoint => {
  const type = getAccessibilityType(node.tags);
  let description = node.tags['wheelchair:description'] || '';

  // Add more detailed accessibility information
  const details: string[] = [];
  
  if (node.tags.tactile_paving === 'yes') {
    details.push('Tactile paving available');
  }
  
  if (node.tags.handrail === 'yes') {
    details.push('Handrails installed');
  }
  
  if (node.tags.automatic_door === 'yes') {
    details.push('Automatic door');
  }

  if (details.length > 0) {
    description = description 
      ? `${description}. ${details.join('. ')}`
      : details.join('. ');
  }

  return {
    id: `osm_${node.id}`,
    type,
    name: node.tags.name || getLocationName(node.tags),
    description: description || null,
    latitude: node.lat,
    longitude: node.lon,
    is_operational: isWheelchairAccessible(node.tags.wheelchair),
    verified: true,
    upvotes: null,
    created_at: null,
    updated_at: null,
    author_id: 'openstreetmap'
  };
};

// Helper function to generate a meaningful name for locations without names
const getLocationName = (tags: OSMNode['tags']): string => {
  if (tags.building && tags.building !== 'yes') {
    return `Accessible ${tags.building.charAt(0).toUpperCase() + tags.building.slice(1)}`;
  }
  if (tags.shop) {
    return `Accessible ${tags.shop.charAt(0).toUpperCase() + tags.shop.slice(1)}`;
  }
  if (tags.healthcare) {
    return `Accessible Healthcare: ${tags.healthcare.charAt(0).toUpperCase() + tags.healthcare.slice(1)}`;
  }
  if (tags.leisure) {
    return `Accessible ${tags.leisure.charAt(0).toUpperCase() + tags.leisure.slice(1)}`;
  }
  return 'Accessible Location';
};

// Build Overpass query for accessibility features
const buildOverpassQuery = (bounds: { north: number; south: number; east: number; west: number }) => {
  return `[out:json][timeout:25];
    (
      // Query for wheelchair accessible places
      way["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      
      // Query for elevators
      way["highway"="elevator"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["highway"="elevator"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["amenity"="elevator"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      
      // Query for accessible toilets
      node["amenity"="toilets"]["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      
      // Query for ramps
      way["highway"="ramp"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["highway"="ramp"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});

      // Query for places with automatic doors
      node["automatic_door"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["automatic_door"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});

      // Query for tactile paving
      node["tactile_paving"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["tactile_paving"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});

      // Query for places with handrails
      node["handrail"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["handrail"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});

      // Query for accessible healthcare facilities
      node["healthcare"]["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["healthcare"]["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});

      // Query for accessible leisure facilities
      node["leisure"]["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["leisure"]["wheelchair"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    );
    out body;
    >;
    out skel qt;`;
};

// Cache structure to store fetched points
interface PointsCache {
  points: AccessibilityPoint[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  timestamp: number;
}

let pointsCache: PointsCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const BOUNDS_THRESHOLD = 0.01; // About 1km at the equator

// Check if a point is within the given bounds with some padding
const isPointInBounds = (
  point: AccessibilityPoint,
  bounds: { north: number; south: number; east: number; west: number }
): boolean => {
  return (
    point.latitude <= bounds.north &&
    point.latitude >= bounds.south &&
    point.longitude <= bounds.east &&
    point.longitude >= bounds.west
  );
};

// Check if new bounds are mostly contained within cached bounds
const isBoundsWithinCache = (
  newBounds: { north: number; south: number; east: number; west: number },
  cachedBounds: { north: number; south: number; east: number; west: number }
): boolean => {
  return (
    Math.abs(newBounds.north - cachedBounds.north) < BOUNDS_THRESHOLD &&
    Math.abs(newBounds.south - cachedBounds.south) < BOUNDS_THRESHOLD &&
    Math.abs(newBounds.east - cachedBounds.east) < BOUNDS_THRESHOLD &&
    Math.abs(newBounds.west - cachedBounds.west) < BOUNDS_THRESHOLD
  );
};

// Get expanded bounds to reduce edge cases
const getExpandedBounds = (bounds: { north: number; south: number; east: number; west: number }) => {
  const latPadding = (bounds.north - bounds.south) * 0.1;
  const lngPadding = (bounds.east - bounds.west) * 0.1;
  return {
    north: bounds.north + latPadding,
    south: bounds.south - latPadding,
    east: bounds.east + lngPadding,
    west: bounds.west - lngPadding
  };
};

// Fetch accessibility points from OpenStreetMap
export const fetchExternalAccessibilityPoints = async (
  bounds: { north: number; south: number; east: number; west: number }
): Promise<AccessibilityPoint[]> => {
  try {
    // Check if we have valid cached data
    if (
      pointsCache &&
      Date.now() - pointsCache.timestamp < CACHE_DURATION &&
      isBoundsWithinCache(bounds, pointsCache.bounds)
    ) {
      // Return only points within the requested bounds
      return pointsCache.points.filter(point => isPointInBounds(point, bounds));
    }

    // Expand bounds slightly to prevent frequent refetching at edges
    const expandedBounds = getExpandedBounds(bounds);
    
    const query = buildOverpassQuery(expandedBounds);
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch OpenStreetMap data');
    }

    const data: OverpassResponse = await response.json();
    
    // Filter out nodes without wheelchair accessibility information
    const accessibleNodes = data.elements.filter(
      node => node.lat && node.lon && (
        node.tags?.wheelchair === 'yes' ||
        node.tags?.highway === 'elevator' ||
        node.tags?.amenity === 'elevator' ||
        node.tags?.highway === 'ramp' ||
        (node.tags?.amenity === 'toilets' && node.tags?.wheelchair === 'yes')
      )
    );

    const points = accessibleNodes.map(convertOSMNode);

    // Update cache
    pointsCache = {
      points,
      bounds: expandedBounds,
      timestamp: Date.now()
    };

    // Return only points within the requested bounds
    return points.filter(point => isPointInBounds(point, bounds));
  } catch (error) {
    console.error('Error fetching OpenStreetMap data:', error);
    toast({
      title: "Error loading accessibility data",
      description: "Unable to fetch accessibility data from OpenStreetMap",
      variant: "destructive"
    });
    
    // If we have cached data, return it as a fallback
    if (pointsCache) {
      return pointsCache.points.filter(point => isPointInBounds(point, bounds));
    }
    
    return [];
  }
}; 