export interface Progress {
  current_streak_days: number;
  longest_streak_days: number;
  total_interviews: number;
  total_training_hours: number;
  average_interview_score: number;
  badges: Badge[];
  current_title: Title | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  awarded_at: string;
  shared_on_facebook: boolean;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  level: number;
  awarded_at: string;
}

export interface AnalyticsState {
  progress: Progress;
  loading: boolean;
  error: string | null;
} 