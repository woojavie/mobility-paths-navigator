import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Navigation, ArrowLeft } from "lucide-react";

interface DirectionsStep {
  instructions: string;
  distance: string;
  duration: string;
}

interface DirectionsPanelProps {
  steps: DirectionsStep[];
  totalDistance: string;
  totalDuration: string;
  onBack?: () => void;
}

const DirectionsPanel = ({ steps, totalDistance, totalDuration, onBack }: DirectionsPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Directions</h2>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-accessBlue" />
            <span className="text-sm font-medium">{totalDistance}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-accessBlue" />
            <span className="text-sm font-medium">{totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-accessBlue transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-accessBlue/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-accessBlue">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{ __html: step.instructions }} 
                />
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{step.distance}</span>
                  <span>•</span>
                  <span>{step.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DirectionsPanel; 