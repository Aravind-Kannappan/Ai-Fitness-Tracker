import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, PlayCircle, AlertTriangle, Download, Check, Info, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useExerciseStore } from '../store/exerciseStore';
import ModelViewer from '../components/ModelViewer';

const ExerciseAnalysis = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { exercises } = useExerciseStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [currentTab, setCurrentTab] = useState<'feedback' | 'errors'>('feedback');
  
  const exercise = exercises.find(ex => ex.id === videoId);
  
  useEffect(() => {
    // Simulate loading delay for analysis
    if (exercise) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [exercise]);
  
  if (!exercise) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-12 w-12 text-warning-400 mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Exercise not found</h2>
        <p className="mt-2 text-neutral-500">The exercise you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard" className="btn btn-primary mt-6">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  // Mock data for the analysis
  const mockFeedback = `
    Your squat form is generally good, but there are a few areas that need attention.
    
    Key observations:
    - Your knees are moving too far forward past your toes, which puts excessive stress on your knee joints
    - Your back is rounding slightly at the bottom of the movement
    - Your weight shifts toward your toes instead of staying in your heels
    
    Suggestions for improvement:
    - Focus on sitting back more, like you're sitting into a chair
    - Keep your chest up and core engaged throughout the movement
    - Drive through your heels on the way up
    - Try box squats to help develop proper depth awareness
    
    Great job on keeping your knees tracking in line with your toes laterally and maintaining consistent depth on each rep!
  `;
  
  const mockErrors = [
    { timestamp: '00:12', severity: 'high', description: 'Knees too far forward', confidence: 0.92 },
    { timestamp: '00:18', severity: 'medium', description: 'Back rounding at bottom position', confidence: 0.86 },
    { timestamp: '00:23', severity: 'medium', description: 'Weight shifting to toes', confidence: 0.78 },
    { timestamp: '00:35', severity: 'low', description: 'Slight knee wobble', confidence: 0.65 }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
          <ChevronLeft size={20} />
          <span className="ml-1">Back to Dashboard</span>
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-7/12 space-y-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">{exercise.exerciseType.charAt(0).toUpperCase() + exercise.exerciseType.slice(1)} Analysis</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                exercise.score > 80 
                  ? 'bg-success-50 text-success-500' 
                  : exercise.score > 50 
                    ? 'bg-warning-50 text-warning-500' 
                    : 'bg-error-50 text-error-500'
              }`}>
                {exercise.score}% Score
              </span>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-neutral-600">Analyzing your exercise form...</p>
              </div>
            ) : (
              <div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  <video
                    src={exercise.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    poster={exercise.thumbnailUrl}
                  />
                  <button 
                    className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-primary-500 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    {showComparison ? 'Hide Comparison' : 'Show Correct Form'}
                  </button>
                </div>
                
                {showComparison && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-neutral-700 mb-2">Your Form</h3>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <img 
                            src={exercise.thumbnailUrl} 
                            alt="Your form"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-neutral-700 mb-2">Correct Form</h3>
                        <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                          <ModelViewer exerciseType={exercise.exerciseType} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <div className="border-b border-neutral-200">
                    <div className="flex space-x-8">
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          currentTab === 'feedback'
                            ? 'border-primary-500 text-primary-500'
                            : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                        }`}
                        onClick={() => setCurrentTab('feedback')}
                      >
                        Coach Feedback
                      </button>
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          currentTab === 'errors'
                            ? 'border-primary-500 text-primary-500'
                            : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                        }`}
                        onClick={() => setCurrentTab('errors')}
                      >
                        Detected Errors
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {currentTab === 'feedback' ? (
                      <div className="prose prose-sm max-w-none">
                        {mockFeedback.split('\n\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {mockErrors.map((error, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center p-3 border rounded-lg border-neutral-200 hover:bg-neutral-50"
                          >
                            <div className={`p-1.5 rounded-full ${
                              error.severity === 'high' 
                                ? 'bg-error-100 text-error-500' 
                                : error.severity === 'medium'
                                  ? 'bg-warning-100 text-warning-500'
                                  : 'bg-neutral-100 text-neutral-500'
                            }`}>
                              <AlertTriangle size={16} />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-neutral-900">{error.description}</p>
                              <p className="text-xs text-neutral-500">
                                Confidence: {(error.confidence * 100).toFixed(0)}%
                              </p>
                            </div>
                            <div className="ml-3 flex items-center text-neutral-500">
                              <Clock size={14} className="mr-1" />
                              <span className="text-xs">{error.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="lg:w-5/12 space-y-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-4">Exercise Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-32 text-sm text-neutral-500">Exercise Type</div>
                <div className="text-sm font-medium">
                  {exercise.exerciseType.charAt(0).toUpperCase() + exercise.exerciseType.slice(1)}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-neutral-500">Fitness Level</div>
                <div className="text-sm font-medium">
                  {exercise.fitnessLevel.charAt(0).toUpperCase() + exercise.fitnessLevel.slice(1)}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-neutral-500">Date</div>
                <div className="text-sm font-medium">{exercise.date}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-neutral-500">Score</div>
                <div className="text-sm font-medium">
                  <span className={`px-2 py-0.5 rounded ${
                    exercise.score > 80 
                      ? 'bg-success-50 text-success-500' 
                      : exercise.score > 50 
                        ? 'bg-warning-50 text-warning-500' 
                        : 'bg-error-50 text-error-500'
                  }`}>
                    {exercise.score}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <button className="btn btn-secondary w-full">
                <Download size={18} className="mr-2" />
                Download Analysis Report
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="card bg-primary-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-start">
              <div className="p-2 bg-primary-100 rounded-full">
                <Info className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-900">Tips for improvement</h3>
                <ul className="mt-2 text-sm text-primary-800 space-y-1">
                  <li className="flex items-start">
                    <Check size={16} className="mt-0.5 mr-1 flex-shrink-0 text-primary-500" />
                    <span>Focus on one correction at a time during practice</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mt-0.5 mr-1 flex-shrink-0 text-primary-500" />
                    <span>Record follow-up videos to track your improvement</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mt-0.5 mr-1 flex-shrink-0 text-primary-500" />
                    <span>Practice with lighter weights until form is corrected</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mt-0.5 mr-1 flex-shrink-0 text-primary-500" />
                    <span>Consider practicing in front of a mirror</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">What's Next?</h2>
            <p className="text-sm text-neutral-600 mb-4">
              Continue improving your form by uploading more videos and tracking your progress over time.
            </p>
            
            <div className="space-y-3">
              <Link to="/upload" className="btn btn-primary w-full">
                <PlayCircle size={18} className="mr-2" />
                Record New Video
              </Link>
              <Link to="/progress" className="btn btn-secondary w-full">
                View Your Progress
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseAnalysis;