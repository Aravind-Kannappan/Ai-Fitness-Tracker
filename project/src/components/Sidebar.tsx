import { X, LayoutDashboard, Upload, BarChart2, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Upload Video', icon: <Upload size={20} />, path: '/upload' },
    { name: 'Progress', icon: <BarChart2 size={20} />, path: '/progress' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold text-primary-500">Menu</h2>
        <button 
          className="md:hidden rounded-full p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 mt-5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-500' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`
            }
            onClick={() => onClose()}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-64 flex flex-col bg-white shadow-lg z-30 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-0 md:border-r border-neutral-200 bg-white">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;