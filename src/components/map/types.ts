// Type definitions for Google Maps
export type GoogleMapType = google.maps.Map;
export type MarkerType = google.maps.Marker;
export type InfoWindowType = google.maps.InfoWindow;

// Type definitions for our data models
export type AccessibilityPointType = 'elevator' | 'ramp' | 'accessible_entrance' | 'accessible_bathroom' | 'tactile_paving' | 'handicap_parking';
export type AccessibilityIssueType = 'construction' | 'broken_elevator' | 'blocked_path' | 'temporary_closure' | 'other';

export type AccessibilityPoint = {
  id: string;
  type: AccessibilityPointType;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  is_operational: boolean;
  verified: boolean | null;
  upvotes: number | null;
  created_at: string | null;
  updated_at: string | null;
  author_id: string;
};

export type AccessibilityIssue = {
  id: string;
  type: AccessibilityIssueType;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  start_date: string | null;
  end_date: string | null;
  verified: boolean | null;
  upvotes: number | null;
  created_at: string | null;
  updated_at: string | null;
  author_id: string;
};

export type PreferencesType = {
  wheelchairAccessible: boolean;
  avoidStairs: boolean;
  elevatorRequired: boolean;
  avoidConstruction: boolean;
};

// Props types for components
export interface MapControlsProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  mapInstance: google.maps.Map | null;
  onAddPoint: () => void;
  onReportIssue: () => void;
}

export interface DirectionsPanelProps {
  steps: {
    instructions: string;
    distance: string;
    duration: string;
  }[];
  totalDistance: string;
  totalDuration: string;
  onBack?: () => void;
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  startLocation: string;
  setStartLocation: React.Dispatch<React.SetStateAction<string>>;
  endLocation: string;
  setEndLocation: React.Dispatch<React.SetStateAction<string>>;
  preferences: PreferencesType;
  togglePreference: (preference: keyof PreferencesType) => void;
  handleFindRoute: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearchPlaces: () => void;
  accessibilityPoints: AccessibilityPoint[];
  accessibilityIssues: AccessibilityIssue[];
  mapInstance: GoogleMapType | null;
  onPointClick?: (point: AccessibilityPoint) => void;
  onIssueClick?: (issue: AccessibilityIssue) => void;
  onPointsUpdate?: () => void;
  onIssuesUpdate?: () => void;
}

export interface RouteResult {
  path: google.maps.LatLng[];
  steps: {
    instructions: string;
    distance: string;
    duration: string;
  }[];
  totalDistance: string;
  totalDuration: string;
}
