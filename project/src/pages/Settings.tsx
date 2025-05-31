import { useState } from 'react';
import { Save, UserCircle, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [formState, setFormState] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    fitnessLevel: 'intermediate',
    fitnessGoals: 'strength',
    notifyFeedback: true,
    notifyTips: true,
    notifyUpdates: false,
    showScoreOnFeed: true,
    passwordVisible: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <UserCircle className="h-6 w-6 text-primary-500 mr-2" />
            <h2 className="text-lg font-semibold">Profile Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formState.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formState.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  type={formState.passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700"
                  onClick={() => setFormState({...formState, passwordVisible: !formState.passwordVisible})}
                >
                  {formState.passwordVisible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="fitnessLevel" className="form-label">Fitness Level</label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                className="form-input"
                value={formState.fitnessLevel}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="fitnessGoals" className="form-label">Fitness Goals</label>
              <select
                id="fitnessGoals"
                name="fitnessGoals"
                className="form-input"
                value={formState.fitnessGoals}
                onChange={handleChange}
              >
                <option value="strength">Strength Training</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="flexibility">Flexibility</option>
                <option value="endurance">Endurance</option>
                <option value="rehabilitation">Rehabilitation</option>
              </select>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-primary-500 mr-2" />
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Exercise Feedback</h3>
                <p className="text-sm text-neutral-500">Get notified when your exercise analysis is ready</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyFeedback"
                  className="sr-only peer"
                  checked={formState.notifyFeedback}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Weekly Tips</h3>
                <p className="text-sm text-neutral-500">Receive personalized exercise tips and advice</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyTips"
                  className="sr-only peer"
                  checked={formState.notifyTips}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Product Updates</h3>
                <p className="text-sm text-neutral-500">Stay informed about new features and improvements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyUpdates"
                  className="sr-only peer"
                  checked={formState.notifyUpdates}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-primary-500 mr-2" />
            <h2 className="text-lg font-semibold">Privacy Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Show Score on Feed</h3>
                <p className="text-sm text-neutral-500">Display your exercise scores in activity feeds</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="showScoreOnFeed"
                  className="sr-only peer"
                  checked={formState.showScoreOnFeed}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Data Storage</h3>
                <p className="text-sm text-neutral-500">
                  Your data is securely stored and used only for improving your exercise form
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Manage Data
              </button>
            </div>
          </div>
        </motion.div>
        
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            <Save size={18} className="mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;