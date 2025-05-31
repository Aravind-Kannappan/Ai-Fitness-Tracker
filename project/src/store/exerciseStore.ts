import { create } from 'zustand';

export interface Exercise {
  id: string;
  exerciseType: string;
  fitnessLevel: string;
  date: string;
  score: number;
  thumbnailUrl: string;
  videoUrl: string;
  errors: Array<{
    timestamp: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    confidence: number;
  }>;
  feedback: string;
}

interface ExerciseStore {
  exercises: Exercise[];
  recentExercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updatedData: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
}

export const useExerciseStore = create<ExerciseStore>((set) => ({
  exercises: [],
  recentExercises: [],
  
  addExercise: (exercise) => set((state) => {
    const updatedExercises = [exercise, ...state.exercises];
    
    return {
      exercises: updatedExercises,
      recentExercises: updatedExercises.slice(0, 5),
    };
  }),
  
  updateExercise: (id, updatedData) => set((state) => {
    const updatedExercises = state.exercises.map((exercise) => 
      exercise.id === id ? { ...exercise, ...updatedData } : exercise
    );
    
    return {
      exercises: updatedExercises,
      recentExercises: updatedExercises.slice(0, 5),
    };
  }),
  
  deleteExercise: (id) => set((state) => {
    const updatedExercises = state.exercises.filter((exercise) => exercise.id !== id);
    
    return {
      exercises: updatedExercises,
      recentExercises: updatedExercises.slice(0, 5),
    };
  }),
}));