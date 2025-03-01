
import { Loader2 } from 'lucide-react';

const MapLoading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-10">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-accessBlue" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  );
};

export default MapLoading;
