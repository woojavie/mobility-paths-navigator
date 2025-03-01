
import { AccessibilityIssueType, AccessibilityPointType } from './types';

// Map icon configurations based on point type
export const getMarkerIcon = (type: string, isOperational = true) => {
  // For demo purposes, we'll use simple colors
  const colors: {[key: string]: string} = {
    elevator: '#4285F4',          // Blue
    ramp: '#34A853',              // Green
    accessible_entrance: '#4285F4', // Blue
    accessible_bathroom: '#673AB7', // Purple
    tactile_paving: '#FF9800',    // Orange
    handicap_parking: '#0F9D58',  // Green
    construction: '#EA4335',      // Red
    broken_elevator: '#EA4335',   // Red
    blocked_path: '#EA4335',      // Red
    temporary_closure: '#EA4335', // Red
    other: '#757575',             // Gray
  };
  
  // Create a custom marker (this will work once google maps is loaded)
  return {
    path: 'M 12,2 C 8.13,2 5,5.13 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.87 -3.13,-7 -7,-7 z M 12,11.5 c -1.38,0 -2.5,-1.12 -2.5,-2.5 0,-1.38 1.12,-2.5 2.5,-2.5 1.38,0 2.5,1.12 2.5,2.5 0,1.38 -1.12,2.5 -2.5,2.5 z',
    fillColor: colors[type] || '#757575',
    fillOpacity: isOperational ? 1 : 0.5,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: 1.5,
    anchor: new google.maps.Point(12, 22),
  };
};

// Helper to create HTML content for the info window
export const createAccessibilityPointInfoContent = (point: {
  name: string;
  type: string;
  description?: string | null;
  is_operational: boolean;
  verified: boolean;
}) => {
  return `
    <div class="p-2">
      <h3 class="font-bold">${point.name}</h3>
      <div class="text-sm mt-1">Type: ${point.type.replace('_', ' ')}</div>
      ${point.description ? `<p class="text-sm mt-1">${point.description}</p>` : ''}
      <div class="text-sm mt-1">Status: ${point.is_operational ? 'Operational' : 'Not operational'}</div>
      ${point.verified ? '<div class="text-sm text-green-600 mt-1">✓ Verified</div>' : ''}
    </div>
  `;
};

export const createAccessibilityIssueInfoContent = (issue: {
  title: string;
  type: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  verified: boolean;
}) => {
  const endDateText = issue.end_date 
    ? `Expected to end: ${new Date(issue.end_date).toLocaleDateString()}`
    : 'End date: Unknown';
  
  return `
    <div class="p-2">
      <h3 class="font-bold">${issue.title}</h3>
      <div class="text-sm mt-1">Type: ${issue.type.replace('_', ' ')}</div>
      ${issue.description ? `<p class="text-sm mt-1">${issue.description}</p>` : ''}
      <div class="text-sm mt-1">Started: ${new Date(issue.start_date).toLocaleDateString()}</div>
      <div class="text-sm mt-1">${endDateText}</div>
      ${issue.verified ? '<div class="text-sm text-green-600 mt-1">✓ Verified</div>' : ''}
    </div>
  `;
};
