import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div 
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-9xl font-bold text-primary-400">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
      <p className="text-neutral-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard" className="btn btn-primary inline-flex items-center">
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </Link>
    </motion.div>
  );
};

export default NotFound;