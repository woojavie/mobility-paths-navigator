import { Button } from '@/components/ui/button';
import { UserRound, LogIn, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const SavedTab = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 overflow-auto">
      <div className="space-y-1">
        <h3 className="font-medium">Saved Places</h3>
        <p className="text-sm text-gray-600">Your favorite accessible locations</p>
      </div>
      
      {user ? (
        <div className="space-y-4">
          {/* This is a placeholder for saved places. You would typically fetch these from your database */}
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">You haven't saved any places yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Explore the map and save places you find helpful
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">Sign in to save your favorite accessible places and routes</p>
          <Button variant="outline" className="mt-3" asChild>
            <Link to="/signin">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedTab;
