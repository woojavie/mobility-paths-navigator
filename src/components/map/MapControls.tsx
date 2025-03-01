
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, Layers, Navigation } from 'lucide-react';

type MapControlsProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const MapControls = ({ isSidebarOpen, toggleSidebar }: MapControlsProps) => {
  return (
    <div className="absolute top-20 right-4 z-10 flex flex-col space-y-2">
      <Button 
        variant="secondary" 
        size="icon" 
        className="rounded-full glass-morphism shadow-button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <ArrowRight className="h-5 w-5" /> : <ArrowRight className="h-5 w-5 rotate-180" />}
      </Button>
      <Button 
        variant="secondary" 
        size="icon" 
        className="rounded-full glass-morphism shadow-button"
        aria-label="Filter map"
      >
        <Filter className="h-5 w-5" />
      </Button>
      <Button 
        variant="secondary" 
        size="icon" 
        className="rounded-full glass-morphism shadow-button"
        aria-label="Change layers"
      >
        <Layers className="h-5 w-5" />
      </Button>
      <Button 
        variant="secondary" 
        size="icon" 
        className="rounded-full glass-morphism shadow-button"
        aria-label="My location"
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapControls;
