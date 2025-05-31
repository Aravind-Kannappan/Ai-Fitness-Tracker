import { ArrowRight, Calendar, Clock, Activity, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExerciseStore } from '../store/exerciseStore';

const Dashboard = () => {
  const { recentExercises } = useExerciseStore();
  
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <Link to="/upload" className="btn btn-primary">
          <Upload size={18} className="mr-2" />
          Upload New Video
        </Link>
      </div>

      <motion.div 
        className="card bg-gradient-to-r from-primary-400 to-primary-500 text-white"
        {...fadeIn}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to FormFit AI</h2>
            <p className="mt-2 text-primary-50">
              Upload a video of your exercise to get personalized feedback and form analysis
            </p>
          </div>
          <Link 
            to="/upload" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white text-primary-500 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Get Started
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="card"
          {...fadeIn}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-start">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-neutral-900">Recent Activity</h3>
              <p className="text-neutral-500">Last exercise: {recentExercises.length > 0 ? '2 days ago' : 'None'}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          {...fadeIn}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-start">
            <div className="p-3 bg-success-50 rounded-lg">
              <Clock className="h-6 w-6 text-success-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-neutral-900">Total Training</h3>
              <p className="text-neutral-500">{recentExercises.length * 15} minutes this week</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          {...fadeIn}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-start">
            <div className="p-3 bg-accent-50 rounded-lg">
              <Activity className="h-6 w-6 text-accent-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-neutral-900">Form Progress</h3>
              <p className="text-neutral-500">{recentExercises.length > 0 ? '12% improvement' : 'No data yet'}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="card"
        {...fadeIn}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Exercises</h2>
          <Link to="/progress" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {recentExercises.length > 0 ? (
          <div className="space-y-4">
            {recentExercises.map((exercise) => (
              <Link 
                key={exercise.id}
                to={`/analysis/${exercise.id}`}
                className="flex items-center p-3 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="bg-neutral-200 h-16 w-24 rounded flex-shrink-0">
                  {exercise.thumbnailUrl && (
                    <img
                      src={exercise.thumbnailUrl}
                      alt={exercise.exerciseType}
                      className="h-full w-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-neutral-900">{exercise.exerciseType}</h4>
                  <div className="flex items-center text-sm text-neutral-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{exercise.date}</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center text-sm font-medium">
                  <span className={`px-2 py-1 rounded ${
                    exercise.score > 80 
                      ? 'bg-success-50 text-success-500' 
                      : exercise.score > 50 
                        ? 'bg-warning-50 text-warning-500' 
                        : 'bg-error-50 text-error-500'
                  }`}>
                    {exercise.score}% Score
                  </span>
                  <ArrowRight size={16} className="ml-2 text-neutral-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-500">No exercises recorded yet</p>
            <Link to="/upload" className="btn btn-primary mt-4">Upload Your First Video</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;