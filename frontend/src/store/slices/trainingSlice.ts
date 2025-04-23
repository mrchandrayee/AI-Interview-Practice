import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { trainingService } from '@/services/api';
import { Lesson } from '@/services/api/training';

export interface AnalysisContent {
  correctness: number;
  suggestions: string[];
}

export interface TranscriptEntry {
  type: 'analysis' | 'content' | 'answer';
  content: AnalysisContent | string;
  timestamp: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface TrainingState {
  modules: TrainingModule[];
  currentModule: TrainingModule | null;
  progress: any | null;
  loading: boolean;
  error: string | null;
  currentSession: string;
  transcript: TranscriptEntry[];
  isRecording: boolean;
}

const initialState: TrainingState = {
  modules: [],
  currentModule: null,
  progress: null,
  loading: false,
  error: null,
  currentSession: '',
  transcript: [],
  isRecording: false,
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<any[]>) => {
      state.modules = action.payload;
    },
    setCurrentModule: (state, action: PayloadAction<any | null>) => {
      state.currentModule = action.payload;
    },
    setProgress: (state, action: PayloadAction<any | null>) => {
      state.progress = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSession = action.payload;
    },
    addTranscriptEntry: (state, action: PayloadAction<Omit<TranscriptEntry, 'timestamp'>>) => {
      state.transcript.push({
        ...action.payload,
        timestamp: Date.now()
      });
    },
    clearTranscript: (state) => {
      state.transcript = [];
    },
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
  },
});

export const {
  setModules,
  setCurrentModule,
  setProgress,
  setLoading,
  setError,
  setCurrentSession,
  addTranscriptEntry,
  clearTranscript,
  setRecording,
} = trainingSlice.actions;

// Thunks
export const fetchModules = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await trainingService.listModules();
    dispatch(setModules(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch modules'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchModule = (id: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await trainingService.getModule(id);
    dispatch(setCurrentModule(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch module'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProgress = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await trainingService.getProgress();
    dispatch(setProgress(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch progress'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const startSession = (id: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await trainingService.startSession(id);
    dispatch(setCurrentModule(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to start session'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const endSession = (id: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await trainingService.endSession(id);
    dispatch(setCurrentModule(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to end session'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default trainingSlice.reducer; 