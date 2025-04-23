import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { analyticsService } from '@/services/api';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  awarded_at?: string;
  shared_on_facebook?: boolean;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface AnalyticsState {
  progress: {
    total_interviews: number;
    total_training_hours: number;
    average_interview_score: number;
    current_streak_days: number;
    longest_streak_days: number;
    badges: Badge[];
    current_title: Title | null;
    session_count: number;
  };
  loading: boolean;
  error: string | null;
  csat_prompt: boolean;
}

const initialState: AnalyticsState = {
  progress: {
    total_interviews: 0,
    total_training_hours: 0,
    average_interview_score: 0,
    current_streak_days: 0,
    longest_streak_days: 0,
    badges: [],
    current_title: null,
    session_count: 0
  },
  loading: false,
  error: null,
  csat_prompt: false
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<AnalyticsState['progress']>) => {
      state.progress = action.payload;
    },
    addBadge: (state, action: PayloadAction<Badge>) => {
      state.progress.badges.push(action.payload);
    },
    updateTitle: (state, action: PayloadAction<Title>) => {
      state.progress.current_title = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCsatPrompt: (state, action: PayloadAction<boolean>) => {
      state.csat_prompt = action.payload;
    },
    shareBadgeOnFacebook: (state, action: PayloadAction<string>) => {
      const badge = state.progress.badges.find(b => b.id === action.payload);
      if (badge) {
        badge.shared_on_facebook = true;
      }
    }
  }
});

export const {
  setProgress,
  addBadge,
  updateTitle,
  setLoading,
  setError,
  setCsatPrompt,
  shareBadgeOnFacebook
} = analyticsSlice.actions;

// Thunks
export const fetchProgress = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await analyticsService.getProgress();
    dispatch(setProgress(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch progress'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const shareBadge = (badgeId: string) => async (dispatch: any) => {
  try {
    await analyticsService.shareBadge(badgeId);
    dispatch(shareBadgeOnFacebook(badgeId));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to share badge'));
  }
};

export const submitCsat = (rating: number, feedback: string) => async (dispatch: any) => {
  try {
    await analyticsService.submitCsat(rating, feedback);
    dispatch(setCsatPrompt(false));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to submit feedback'));
  }
};

export default analyticsSlice.reducer; 