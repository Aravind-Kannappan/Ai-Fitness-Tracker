import { Menu, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              type="button" 
              className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              onClick={onMenuClick}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            
            <div className="ml-4 md:ml-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Logo className="h-8 w-auto" />
                <span className="ml-2 text-xl font-semibold text-primary-500 hidden md:block">
                  FormFit AI
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              type="button" 
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            <Link 
              to="/settings" 
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              aria-label="User settings"
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;