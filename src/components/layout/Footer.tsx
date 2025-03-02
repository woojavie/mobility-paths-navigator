import { Link } from 'react-router-dom';
import { 
  MapPin, Heart, Instagram, Twitter, Facebook, Linkedin, Github 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-accessBlue rounded-lg p-1.5">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                PathAble
              </span>
            </Link>
            <p className="text-sm text-gray-600 max-w-xs">
              Empowering people with mobility challenges to navigate public spaces with confidence.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-accessBlue transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-accessBlue transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-accessBlue transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-accessBlue transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-accessBlue transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/map" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Accessible Maps
                </Link>
              </li>
              <li>
                <Link to="/route-planning" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Route Planning
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-gray-600 hover:text-accessBlue transition-colors">
                  User Contributions
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Community Features
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-accessBlue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-accessBlue transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-600 hover:text-accessBlue transition-colors">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PathAble. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-accessOrange mx-1" /> for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
