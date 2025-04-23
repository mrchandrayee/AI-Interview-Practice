import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use these hooks throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common state access
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
  };
};

export const useCurrentInterview = () => {
  const interview = useAppSelector((state) => state.interview);
  return {
    currentSession: interview.currentSession,
    loading: interview.loading,
    error: interview.error,
  };
};

export const useTrainingProgress = () => {
  const training = useAppSelector((state) => state.training);
  return {
    modules: training.modules,
    currentModuleId: training.currentModuleId,
    currentLessonId: training.currentLessonId,
    progress: training.progress,
    loading: training.loading,
    error: training.error,
  };
};