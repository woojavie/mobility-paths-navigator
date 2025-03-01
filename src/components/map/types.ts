
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
  verified: boolean;
};

export type AccessibilityIssue = {
  id: string;
  type: AccessibilityIssueType;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string | null;
  verified: boolean;
};

export type PreferencesType = {
  wheelchairAccessible: boolean;
  avoidStairs: boolean;
  elevatorRequired: boolean;
  avoidConstruction: boolean;
};
