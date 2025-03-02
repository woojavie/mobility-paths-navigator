import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, MapPin, Search, User, ChevronDown, HelpCircle, LogIn, LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'glass-morphism py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-accessBlue rounded-lg p-1.5">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              AccessPath
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/map" className="font-medium transition-colors hover:text-accessBlue">Map</Link>
            {user && (
              <Link to="/contribute" className="font-medium transition-colors hover:text-accessBlue">Contribute</Link>
            )}
            <Link to="/community" className="font-medium transition-colors hover:text-accessBlue">Community</Link>
            <Link to="/about" className="font-medium transition-colors hover:text-accessBlue">About</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="rounded-full" asChild>
                <Link to="/signin">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-morphism animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/map" 
              className="px-4 py-3 rounded-lg hover:bg-accessBlue/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Map
            </Link>
            {user && (
              <Link 
                to="/contribute" 
                className="px-4 py-3 rounded-lg hover:bg-accessBlue/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contribute
              </Link>
            )}
            <Link 
              to="/community" 
              className="px-4 py-3 rounded-lg hover:bg-accessBlue/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 rounded-lg hover:bg-accessBlue/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="px-4 py-3 rounded-lg hover:bg-accessBlue/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2 inline" />
                    Profile
                  </Link>
                  <Button 
                    className="w-full justify-start"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button className="w-full justify-start" asChild>
                  <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
