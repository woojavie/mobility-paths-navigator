
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accessibility, ArrowUp, Search } from 'lucide-react';
import { AccessibilityPoint, GoogleMapType } from './types';

type ExploreTabProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearchPlaces: () => void;
  accessibilityPoints: AccessibilityPoint[];
  mapInstance: GoogleMapType | null;
};

const ExploreTab = ({
  searchQuery,
  setSearchQuery,
  handleSearchPlaces,
  accessibilityPoints,
  mapInstance
}: ExploreTabProps) => {
  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input 
          placeholder="Search for accessible places"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchPlaces()}
        />
        <Button 
          className="absolute right-1 top-1 h-8" 
          size="sm"
          onClick={handleSearchPlaces}
        >
          Search
        </Button>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium">Nearby Accessible Places</h3>
        <p className="text-sm text-gray-600">Explore wheelchair accessible locations in this area</p>
      </div>
      
      <div className="space-y-3">
        {accessibilityPoints.length > 0 ? (
          accessibilityPoints.slice(0, 5).map((point) => (
            <div 
              key={point.id}
              className="border rounded-lg p-4 space-y-2 hover:border-accessBlue transition-colors cursor-pointer"
              onClick={() => {
                if (mapInstance) {
                  mapInstance.setCenter({ 
                    lat: Number(point.latitude), 
                    lng: Number(point.longitude) 
                  });
                  mapInstance.setZoom(18);
                }
              }}
            >
              <h4 className="font-medium">{point.name}</h4>
              <div className="flex space-x-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <Accessibility className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                  {point.type.replace('_', ' ')}
                </span>
                {point.type === 'elevator' && (
                  <span className="flex items-center">
                    <ArrowUp className="h-3.5 w-3.5 mr-1 text-accessBlue" />
                    Elevator
                  </span>
                )}
              </div>
              {point.description && (
                <p className="text-sm text-gray-600">{point.description}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No accessibility points found nearby.</p>
            <p className="text-sm text-gray-400 mt-1">Try searching in a different area or contribute by adding points!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTab;
