import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Navigation2 } from 'lucide-react';
import { AccessibilityPoint, GoogleMapType, PreferencesType, AccessibilityIssue } from './types';
import RouteTab from './RouteTab';
import ExploreTab from './ExploreTab';
import SavedTab from './SavedTab';
import CommunityTab from './CommunityTab';

type SidebarProps = {
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
};

const Sidebar = ({
  isSidebarOpen,
  activeTab,
  setActiveTab,
  startLocation,
  setStartLocation,
  endLocation,
  setEndLocation,
  preferences,
  togglePreference,
  handleFindRoute,
  searchQuery,
  setSearchQuery,
  handleSearchPlaces,
  accessibilityPoints,
  accessibilityIssues,
  mapInstance,
  onPointClick = () => {},
  onIssueClick = () => {},
  onPointsUpdate = () => {},
  onIssuesUpdate = () => {}
}: SidebarProps) => {
  const handlePointClick = (point: AccessibilityPoint) => {
    if (mapInstance) {
      mapInstance.setCenter({ lat: Number(point.latitude), lng: Number(point.longitude) });
      mapInstance.setZoom(18);
    }
    onPointClick(point);
  };

  const handleIssueClick = (issue: AccessibilityIssue) => {
    if (mapInstance) {
      mapInstance.setCenter({ lat: Number(issue.latitude), lng: Number(issue.longitude) });
      mapInstance.setZoom(18);
    }
    onIssueClick(issue);
  };

  return (
    <div 
      className={`bg-white border-l border-gray-200 h-screen transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-96' : 'w-0 overflow-hidden'
      }`}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 px-2 py-2">
          <TabsTrigger value="route" className="flex items-center gap-2">
            <Navigation2 className="h-4 w-4" />
            Route
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="community">
            Community
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="route" className="m-0 h-full">
            <RouteTab 
              startLocation={startLocation}
              setStartLocation={setStartLocation}
              endLocation={endLocation}
              setEndLocation={setEndLocation}
              preferences={preferences}
              togglePreference={togglePreference}
              handleFindRoute={handleFindRoute}
            />
          </TabsContent>
          
          <TabsContent value="search" className="m-0 h-full">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Accessibility Points</Label>
                <div className="flex space-x-2">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or description"
                  />
                  <Button onClick={handleSearchPlaces}>
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="m-0 h-full">
            <CommunityTab
              accessibilityPoints={accessibilityPoints}
              accessibilityIssues={accessibilityIssues}
              onPointClick={handlePointClick}
              onIssueClick={handleIssueClick}
              onPointsUpdate={onPointsUpdate}
              onIssuesUpdate={onIssuesUpdate}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sidebar;
