import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accessibility, ArrowUp, Construction, MapPin, Stars } from 'lucide-react';
import { PreferencesType } from './types';
import LocationSearchInput from './LocationSearchInput';

type RouteTabProps = {
  startLocation: string;
  setStartLocation: React.Dispatch<React.SetStateAction<string>>;
  endLocation: string;
  setEndLocation: React.Dispatch<React.SetStateAction<string>>;
  preferences: PreferencesType;
  togglePreference: (preference: keyof PreferencesType) => void;
  handleFindRoute: () => void;
};

const RouteTab = ({
  startLocation,
  setStartLocation,
  endLocation,
  setEndLocation,
  preferences,
  togglePreference,
  handleFindRoute
}: RouteTabProps) => {
  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
      <div className="space-y-2">
        <label htmlFor="start" className="text-sm font-medium text-gray-700">Start</label>
        <LocationSearchInput
          placeholder="Current location"
          value={startLocation}
          onChange={setStartLocation}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination</label>
        <LocationSearchInput
          placeholder="Enter destination"
          value={endLocation}
          onChange={setEndLocation}
          className="w-full"
        />
      </div>

      <div className="space-y-3 pt-4">
        <h3 className="font-medium text-gray-900">Route Preferences</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="wheelchair"
            checked={preferences.wheelchairAccessible}
            onCheckedChange={() => togglePreference('wheelchairAccessible')}
          />
          <Label htmlFor="wheelchair" className="flex items-center space-x-2">
            <Accessibility className="h-4 w-4" />
            <span>Wheelchair accessible</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="stairs"
            checked={preferences.avoidStairs}
            onCheckedChange={() => togglePreference('avoidStairs')}
          />
          <Label htmlFor="stairs" className="flex items-center space-x-2">
            <Stars className="h-4 w-4" />
            <span>Avoid stairs</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="elevator"
            checked={preferences.elevatorRequired}
            onCheckedChange={() => togglePreference('elevatorRequired')}
          />
          <Label htmlFor="elevator" className="flex items-center space-x-2">
            <ArrowUp className="h-4 w-4" />
            <span>Elevator required</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="construction"
            checked={preferences.avoidConstruction}
            onCheckedChange={() => togglePreference('avoidConstruction')}
          />
          <Label htmlFor="construction" className="flex items-center space-x-2">
            <Construction className="h-4 w-4" />
            <span>Avoid construction</span>
          </Label>
        </div>
      </div>

      <Button 
        className="w-full mt-4" 
        size="lg"
        onClick={handleFindRoute}
      >
        Find Route
      </Button>
    </div>
  );
};

export default RouteTab;
