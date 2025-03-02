import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Navigation } from "lucide-react";

interface DirectionsStep {
  instructions: string;
  distance: string;
  duration: string;
}

interface DirectionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  steps: DirectionsStep[];
  totalDistance: string;
  totalDuration: string;
}

const DirectionsDialog = ({ 
  isOpen, 
  onClose, 
  steps, 
  totalDistance, 
  totalDuration 
}: DirectionsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>Directions</DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-accessBlue" />
            <span className="text-sm font-medium">{totalDistance}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-accessBlue" />
            <span className="text-sm font-medium">{totalDuration}</span>
          </div>
        </div>

        {/* Steps */}
        <ScrollArea className="flex-1 p-6 pt-4">
          <div className="space-y-3 pr-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default DirectionsDialog; 