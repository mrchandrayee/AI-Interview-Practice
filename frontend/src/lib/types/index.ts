// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  tier: 'free' | 'popular' | 'elite';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: string;
  features: string[];
}

// Interview-related types
export interface InterviewConfig {
  resumeUrl?: string;
  jobDescription?: string;
  interviewerType: 'peer' | 'manager' | 'bar_raiser';
  interviewerVoice: 'male' | 'female';
  duration?: number; // in minutes
}

export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  transcript: TranscriptEntry[];
  assessment?: Assessment;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptEntry {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
}

export interface Assessment {
  domainExpertise: number;
  communication: number;
  cultureFit: number;
  problemSolving: number;
  selfAwareness: number;
  overallScore: number;
  feedback: string;
  improvementAreas: string[];
}

// Training-related types
export interface TrainingModule {
  id: string;
  title: string;
  subject: 'data_analytics' | 'accounting' | 'interview_polish';
  description: string;
  totalHours: number;
  completedHours: number;
  lessons: Lesson[];
  prerequisites?: string[];
  skills: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: number; // in minutes
  completed: boolean;
  lastAccessed?: string;
  content: LessonContent;
}

export interface LessonContent {
  type: 'video' | 'audio' | 'text' | 'interactive';
  data: {
    url?: string;
    text?: string;
    questions?: Question[];
  };
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'open_ended';
  options?: string[];
  correctAnswer?: string;
}

// Progress tracking types
export interface Progress {
  [moduleId: string]: ModuleProgress;
}

export interface ModuleProgress {
  completedLessons: number;
  totalLessons: number;
  streak: number;
  lastCompleted?: string;
  score?: number;
  timeSpent: number; // in minutes
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

// Common utility types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}