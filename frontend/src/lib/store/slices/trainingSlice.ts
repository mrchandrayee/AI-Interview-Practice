import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface TrainingModule {
  id: string;
  title: string;
  subject: 'data_analytics' | 'accounting' | 'interview_polish';
  description: string;
  totalHours: number;
  completedHours: number;
  lessons: Array<{
    id: string;
    title: string;
    duration: number;
    completed: boolean;
    lastAccessed?: string;
  }>;
}

interface TrainingState {
  modules: TrainingModule[];
  currentModuleId: string | null;
  currentLessonId: string | null;
  progress: {
    [moduleId: string]: {
      completedLessons: number;
      totalLessons: number;
      streak: number;
      lastCompleted?: string;
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: TrainingState = {
  modules: [],
  currentModuleId: null,
  currentLessonId: null,
  progress: {},
  loading: false,
  error: null,
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setModules: (state: TrainingState, action: PayloadAction<TrainingModule[]>) => {
      state.modules = action.payload;
      action.payload.forEach((module) => {
        if (!state.progress[module.id]) {
          state.progress[module.id] = {
            completedLessons: 0,
            totalLessons: module.lessons.length,
            streak: 0,
          };
        }
      });
    },
    setCurrentModule: (state: TrainingState, action: PayloadAction<string>) => {
      state.currentModuleId = action.payload;
      state.currentLessonId = null;
    },
    setCurrentLesson: (state: TrainingState, action: PayloadAction<string>) => {
      state.currentLessonId = action.payload;
    },
    completeLesson: (
      state: TrainingState,
      action: PayloadAction<{ moduleId: string; lessonId: string }>
    ) => {
      const module = state.modules.find((m) => m.id === action.payload.moduleId);
      if (module) {
        const lesson = module.lessons.find((l) => l.id === action.payload.lessonId);
        if (lesson && !lesson.completed) {
          lesson.completed = true;
          lesson.lastAccessed = new Date().toISOString();
          
          // Update progress
          const moduleProgress = state.progress[module.id];
          moduleProgress.completedLessons++;
          
          // Update streak if completed within 24 hours of last completion
          const lastCompleted = moduleProgress.lastCompleted
            ? new Date(moduleProgress.lastCompleted)
            : null;
          const now = new Date();
          
          if (
            !lastCompleted ||
            now.getTime() - lastCompleted.getTime() <= 24 * 60 * 60 * 1000
          ) {
            moduleProgress.streak++;
          } else {
            moduleProgress.streak = 1;
          }
          
          moduleProgress.lastCompleted = now.toISOString();
        }
      }
    },
    resetProgress: (state: TrainingState, action: PayloadAction<string>) => {
      const module = state.modules.find((m) => m.id === action.payload);
      if (module) {
        module.lessons.forEach((lesson) => {
          lesson.completed = false;
          lesson.lastAccessed = undefined;
        });
        state.progress[module.id] = {
          completedLessons: 0,
          totalLessons: module.lessons.length,
          streak: 0,
        };
      }
    },
    setError: (state: TrainingState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state: TrainingState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setModules,
  setCurrentModule,
  setCurrentLesson,
  completeLesson,
  resetProgress,
  setError,
  setLoading,
} = trainingSlice.actions;

// Type-safe selectors
export const selectModules = (state: RootState) => state.training.modules;
export const selectCurrentModule = (state: RootState) => {
  const modules = state.training.modules;
  const currentModuleId = state.training.currentModuleId;
  return modules.find((module: TrainingModule) => module.id === currentModuleId);
};
export const selectProgress = (state: RootState) => state.training.progress;

// Additional selectors for specific data
export const selectCurrentModuleProgress = (state: RootState) => {
  const currentModuleId = state.training.currentModuleId;
  return currentModuleId ? state.training.progress[currentModuleId] : null;
};

export default trainingSlice.reducer;