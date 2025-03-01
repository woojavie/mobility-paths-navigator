
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccessibilityPoint, GoogleMapType, PreferencesType } from './types';
import RouteTab from './RouteTab';
import ExploreTab from './ExploreTab';
import SavedTab from './SavedTab';

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
  mapInstance: GoogleMapType | null;
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
  mapInstance
}: SidebarProps) => {
  return (
    <div 
      className={`bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'w-full md:w-96' : 'w-0 overflow-hidden'
      }`}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <TabsList className="w-full">
            <TabsTrigger value="route" className="flex-1">Route</TabsTrigger>
            <TabsTrigger value="explore" className="flex-1">Explore</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="route">
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
        
        <TabsContent value="explore">
          <ExploreTab 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchPlaces={handleSearchPlaces}
            accessibilityPoints={accessibilityPoints}
            mapInstance={mapInstance}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
