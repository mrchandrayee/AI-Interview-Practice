export const APP_NAME = 'AI Interview Practice';
export const APP_DESCRIPTION = 'Enhance your interview skills with AI-powered mock interviews and personalized training modules';

// Authentication
export const AUTH_ERRORS = {
  DEFAULT: 'Authentication failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  POPULAR: 'popular',
  ELITE: 'elite',
} as const;

export const TIER_FEATURES = {
  [SUBSCRIPTION_TIERS.FREE]: {
    name: 'Free',
    price: 0,
    features: [
      '2 mock interviews',
      '1 hour of training',
      'Basic interview feedback',
    ],
    maxInterviews: 2,
    maxTrainingHours: 1,
  },
  [SUBSCRIPTION_TIERS.POPULAR]: {
    name: 'Popular',
    price: 49,
    features: [
      'Unlimited mock interviews',
      'Full access to training modules',
      'Detailed performance analytics',
      'Interview recording and playback',
    ],
    maxInterviews: Infinity,
    maxTrainingHours: Infinity,
  },
  [SUBSCRIPTION_TIERS.ELITE]: {
    name: 'Elite',
    price: 99,
    features: [
      'All Popular features',
      'Monthly group session with human expert',
      'Priority support',
      'Custom interview scenarios',
    ],
    maxInterviews: Infinity,
    maxTrainingHours: Infinity,
  },
} as const;

// Training modules
export const TRAINING_SUBJECTS = {
  DATA_ANALYTICS: 'data_analytics',
  ACCOUNTING: 'accounting',
  INTERVIEW_POLISH: 'interview_polish',
} as const;

export const INTERVIEWER_TYPES = {
  PEER: 'peer',
  MANAGER: 'manager',
  BAR_RAISER: 'bar_raiser',
} as const;

export const INTERVIEWER_VOICES = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

// Assessment thresholds
export const ASSESSMENT_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  NEEDS_IMPROVEMENT: 0,
} as const;

// API endpoints
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  INTERVIEWS: {
    START: '/interviews/start',
    LIST: '/interviews',
    DETAIL: (id: string) => `/interviews/${id}`,
  },
  TRAINING: {
    MODULES: '/training/modules',
    MODULE_DETAIL: (id: string) => `/training/modules/${id}`,
    COMPLETE_LESSON: (moduleId: string, lessonId: string) =>
      `/training/modules/${moduleId}/lessons/${lessonId}/complete`,
  },
  SUBSCRIPTIONS: {
    CREATE: '/subscriptions/create',
    CANCEL: '/subscriptions/cancel',
    UPGRADE: '/subscriptions/upgrade',
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  THEME: 'theme',
  INTERVIEW_DRAFT: 'interview_draft',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm',
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  START_INTERVIEW: 'start_interview',
  COMPLETE_INTERVIEW: 'complete_interview',
  START_TRAINING: 'start_training',
  COMPLETE_LESSON: 'complete_lesson',
  UPGRADE_SUBSCRIPTION: 'upgrade_subscription',
} as const;