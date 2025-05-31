import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Video, Check, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useExerciseStore } from '../store/exerciseStore';

const UploadVideo = () => {
  const navigate = useNavigate();
  const { addExercise } = useExerciseStore();
  
  const [file, setFile] = useState<File | null>(null);
  const [exerciseType, setExerciseType] = useState('squat');
  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
      }
    },
    onDropRejected: (rejections) => {
      if (rejections.length > 0) {
        const { code } = rejections[0].errors[0];
        if (code === 'file-too-large') {
          setError('File is too large. Maximum size is 100MB.');
        } else if (code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a video file.');
        } else {
          setError('Error uploading file. Please try again.');
        }
      }
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a video file.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    try {
      // In a real app, you would send the file to your backend API
      // await api.uploadExerciseVideo(file, exerciseType, fitnessLevel);
      
      // Mock API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Add to store (would normally come from API response)
      const newExercise = {
        id: Date.now().toString(),
        exerciseType,
        fitnessLevel,
        date: new Date().toLocaleDateString(),
        score: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
        thumbnailUrl: URL.createObjectURL(file),
        videoUrl: URL.createObjectURL(file),
        errors: [],
        feedback: '',
      };
      
      addExercise(newExercise);
      
      // Simulate processing time
      setTimeout(() => {
        setIsUploading(false);
        clearInterval(interval);
        navigate(`/analysis/${newExercise.id}`);
      }, 500);
      
    } catch (err) {
      setError('Error uploading file. Please try again.');
      setIsUploading(false);
      clearInterval(interval);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Upload Exercise Video</h1>
      
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="exerciseType" className="form-label">Exercise Type</label>
            <select
              id="exerciseType"
              className="form-input"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
            >
              <option value="squat">Squat</option>
              <option value="deadlift">Deadlift</option>
              <option value="pushup">Push-up</option>
              <option value="plank">Plank</option>
              <option value="lunge">Lunge</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fitnessLevel" className="form-label">Fitness Level</label>
            <select
              id="fitnessLevel"
              className="form-input"
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <span className="form-label">Upload Video</span>
            
            {!file ? (
              <div 
                {...getRootProps()} 
                className={`mt-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary-400 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'
                } ${isDragReject || error ? 'border-error-400 bg-error-50' : ''}`}
              >
                <input {...getInputProps()} />
                
                <Video className={`h-12 w-12 mb-3 ${
                  isDragActive ? 'text-primary-400' : 'text-neutral-400'
                } ${isDragReject || error ? 'text-error-400' : ''}`} />
                
                <p className="text-center text-sm">
                  {isDragActive 
                    ? 'Drop the video file here' 
                    : isDragReject 
                      ? 'Unsupported file format' 
                      : 'Drag and drop your video here, or click to browse'}
                </p>
                <p className="text-center text-xs text-neutral-500 mt-1">
                  Supports MP4, MOV, AVI, WebM (max 100MB)
                </p>
              </div>
            ) : (
              <div className="mt-1 border rounded-lg p-4 bg-neutral-50">
                <div className="flex items-center">
                  <Video className="h-8 w-8 text-primary-400" />
                  <div className="ml-3 flex-1 truncate">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors"
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <p className="form-error mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading ({uploadProgress}%)
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </form>
        
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-400 rounded-full animate-progress transition-all duration-150 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-neutral-500">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="mt-8 card bg-primary-50">
        <div className="flex items-start">
          <div className="p-2 bg-primary-100 rounded-full">
            <Check className="h-5 w-5 text-primary-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-primary-900">Tips for better analysis</h3>
            <ul className="mt-2 text-sm text-primary-800 space-y-1">
              <li>• Ensure good lighting so your form is clearly visible</li>
              <li>• Position the camera to capture your full body</li>
              <li>• Wear clothes that allow your joints to be visible</li>
              <li>• Record in landscape mode for better analysis</li>
              <li>• Try to keep a neutral background</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;