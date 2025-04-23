import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface InterviewConfig {
  resumeUrl?: string;
  jobDescription?: string;
  interviewerType: 'peer' | 'manager' | 'bar_raiser';
  interviewerVoice: 'male' | 'female';
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  transcript: Array<{
    role: 'interviewer' | 'candidate';
    content: string;
    timestamp: string;
  }>;
  assessment?: {
    domainExpertise: number;
    communication: number;
    cultureFit: number;
    problemSolving: number;
    selfAwareness: number;
    overallScore: number;
    feedback: string;
    improvementAreas: string[];
  };
}

interface InterviewState {
  currentSession: InterviewSession | null;
  pastSessions: InterviewSession[];
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  currentSession: null,
  pastSessions: [],
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startSession: (state: InterviewState, action: PayloadAction<InterviewConfig>) => {
      state.currentSession = {
        id: crypto.randomUUID(),
        config: action.payload,
        status: 'pending',
        transcript: [],
      };
      state.loading = false;
      state.error = null;
    },
    updateSessionStatus: (
      state: InterviewState,
      action: PayloadAction<{ status: InterviewSession['status'] }>
    ) => {
      if (state.currentSession) {
        state.currentSession.status = action.payload.status;
        if (action.payload.status === 'in_progress') {
          state.currentSession.startTime = new Date().toISOString();
        } else if (
          action.payload.status === 'completed' ||
          action.payload.status === 'failed'
        ) {
          state.currentSession.endTime = new Date().toISOString();
        }
      }
    },
    addTranscriptEntry: (
      state: InterviewState,
      action: PayloadAction<{
        role: 'interviewer' | 'candidate';
        content: string;
      }>
    ) => {
      if (state.currentSession) {
        state.currentSession.transcript.push({
          ...action.payload,
          timestamp: new Date().toISOString(),
        });
      }
    },
    setAssessment: (
      state: InterviewState,
      action: PayloadAction<NonNullable<InterviewSession['assessment']>>
    ) => {
      if (state.currentSession) {
        state.currentSession.assessment = action.payload;
      }
    },
    endSession: (state: InterviewState) => {
      if (state.currentSession) {
        state.pastSessions.unshift({ ...state.currentSession });
        state.currentSession = null;
      }
    },
    setError: (state: InterviewState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state: InterviewState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  startSession,
  updateSessionStatus,
  addTranscriptEntry,
  setAssessment,
  endSession,
  setError,
  setLoading,
} = interviewSlice.actions;

export const selectCurrentSession = (state: RootState) =>
  state.interview.currentSession;
export const selectPastSessions = (state: RootState) =>
  state.interview.pastSessions;

export default interviewSlice.reducer;