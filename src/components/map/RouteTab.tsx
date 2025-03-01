
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accessibility, ArrowUp, Construction, MapPin, Stars } from 'lucide-react';
import { PreferencesType } from './types';

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
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            id="start"
            placeholder="Current location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            id="destination"
            placeholder="Enter destination"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-medium">Accessibility Preferences</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="wheelchair-required" 
              checked={preferences.wheelchairAccessible}
              onCheckedChange={() => togglePreference('wheelchairAccessible')}
            />
            <Label htmlFor="wheelchair-required" className="flex items-center">
              <Accessibility className="h-4 w-4 mr-2 text-accessBlue" />
              Wheelchair accessible
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-stairs"
              checked={preferences.avoidStairs}
              onCheckedChange={() => togglePreference('avoidStairs')}
            />
            <Label htmlFor="avoid-stairs" className="flex items-center">
              <Stars className="h-4 w-4 mr-2 text-accessOrange" />
              Avoid stairs
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="elevator-required"
              checked={preferences.elevatorRequired}
              onCheckedChange={() => togglePreference('elevatorRequired')}
            />
            <Label htmlFor="elevator-required" className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-2 text-accessBlue" />
              Elevator required
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-construction" 
              checked={preferences.avoidConstruction}
              onCheckedChange={() => togglePreference('avoidConstruction')}
            />
            <Label htmlFor="avoid-construction" className="flex items-center">
              <Construction className="h-4 w-4 mr-2 text-accessOrange" />
              Avoid construction
            </Label>
          </div>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleFindRoute}>
        Find Accessible Route
      </Button>
      
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium">Sample Route</h3>
        <p className="text-sm text-gray-600">Example of an accessible route from Central Park to Times Square with elevator access.</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <div className="bg-accessBlue rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">1</span>
            </div>
            <p>Head east on W 59th St toward 5th Ave (wheelchair accessible sidewalk)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-accessBlue rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">2</span>
            </div>
            <p>Take elevator at 5th Ave subway station (South entrance)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-accessBlue rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">3</span>
            </div>
            <p>Board accessible N train toward Times Square</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-accessBlue rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">4</span>
            </div>
            <p>Exit at Times Square station using elevator at NW corner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTab;
