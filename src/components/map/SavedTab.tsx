
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';

const SavedTab = () => {
  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
      <div className="space-y-1">
        <h3 className="font-medium">Saved Places</h3>
        <p className="text-sm text-gray-600">Your favorite accessible locations</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">Sign in to save your favorite accessible places and routes</p>
        <Button variant="outline" className="mt-3">
          <UserRound className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SavedTab;
