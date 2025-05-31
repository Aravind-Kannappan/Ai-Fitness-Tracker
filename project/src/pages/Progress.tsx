import { useState } from 'react';
import { Calendar, TrendingUp, ChevronRight, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExerciseStore } from '../store/exerciseStore';

const Progress = () => {
  const { exercises } = useExerciseStore();
  const [selectedExerciseType, setSelectedExerciseType] = useState<string>('all');
  
  const filteredExercises = selectedExerciseType === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.exerciseType === selectedExerciseType);
    
  const exerciseTypes = ['all', ...Array.from(new Set(exercises.map(ex => ex.exerciseType)))];
  
  const getAverageScore = (exercises: typeof filteredExercises) => {
    if (exercises.length === 0) return 0;
    return Math.round(exercises.reduce((sum, ex) => sum + ex.score, 0) / exercises.length);
  };
  
  const averageScore = getAverageScore(filteredExercises);
  
  // Generate mock progress data
  const generateProgressData = () => {
    if (filteredExercises.length === 0) return [];
    
    return Array.from({ length: Math.min(10, filteredExercises.length) }, (_, i) => {
      // If we have actual exercises, use their scores, otherwise generate mock data
      const score = filteredExercises[i]?.score || Math.floor(Math.random() * 30) + 50 + i * 2;
      return {
        date: new Date(Date.now() - (9 - i) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        score
      };
    });
  };
  
  const progressData = generateProgressData();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Your Progress</h1>
        <Link to="/upload" className="btn btn-primary">
          <Upload size={18} className="mr-2" />
          Upload New Video
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {exerciseTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedExerciseType === type
                ? 'bg-primary-100 text-primary-800'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setSelectedExerciseType(type)}
          >
            {type === 'all' ? 'All Exercises' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      
      {exercises.length === 0 ? (
        <motion.div 
          className="card text-center py-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TrendingUp className="h-12 w-12 text-neutral-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">No progress data yet</h2>
          <p className="mt-2 text-neutral-500">Upload your first exercise video to start tracking your progress.</p>
          <Link to="/upload" className="btn btn-primary mt-6">
            Upload First Video
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                Average Score
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-neutral-900">{averageScore}%</p>
                <p className="ml-2 text-sm text-success-500 flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  +5% from last month
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                Videos Analyzed
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-neutral-900">{filteredExercises.length}</p>
                <p className="ml-2 text-sm text-neutral-500">
                  Total exercises
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                Last Uploaded
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-neutral-900">
                  {filteredExercises.length > 0 ? filteredExercises[0].date : 'N/A'}
                </p>
                <p className="ml-2 text-sm text-neutral-500 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Recent activity
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold mb-6">Form Progress Over Time</h2>
            
            <div className="h-64 px-4">
              {progressData.length > 0 ? (
                <div className="relative h-full">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-neutral-500">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute left-8 right-0 inset-y-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-b border-neutral-100 w-full h-0"></div>
                    ))}
                  </div>
                  
                  {/* Chart */}
                  <div className="absolute left-10 right-0 inset-y-0 flex items-end justify-between">
                    {progressData.map((data, i) => (
                      <div key={i} className="flex flex-col items-center w-12">
                        <div className="w-12 flex justify-center mb-1">
                          <div 
                            className="w-8 bg-primary-400 rounded-t-sm transition-all duration-500 ease-out"
                            style={{ height: `${(data.score / 100) * 100}%`, maxHeight: '100%' }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-500 truncate w-full text-center">
                          {data.date.split('/').slice(0, 2).join('/')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-neutral-500">No data available for the selected exercise type</p>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold mb-4">Exercise History</h2>
            
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Exercise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <tr key={exercise.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {exercise.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {exercise.exerciseType.charAt(0).toUpperCase() + exercise.exerciseType.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            exercise.score > 80 
                              ? 'bg-success-50 text-success-500' 
                              : exercise.score > 50 
                                ? 'bg-warning-50 text-warning-500' 
                                : 'bg-error-50 text-error-500'
                          }`}>
                            {exercise.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {exercise.fitnessLevel.charAt(0).toUpperCase() + exercise.fitnessLevel.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/analysis/${exercise.id}`} 
                            className="text-primary-500 hover:text-primary-700 flex items-center justify-end"
                          >
                            View Analysis
                            <ChevronRight size={16} className="ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-500">
                        No exercises found for the selected type
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Progress;