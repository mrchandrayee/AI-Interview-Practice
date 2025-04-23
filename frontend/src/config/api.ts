export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      LOGOUT: '/auth/logout/',
      REFRESH: '/auth/token/refresh/',
      GOOGLE: '/auth/google',
      FACEBOOK: '/auth/facebook',
      LINKEDIN: '/auth/linkedin',
    },
    // User
    USER: {
      PROFILE: '/users/profile',
      UPDATE: '/users/update',
      DELETE: '/users/delete',
    },
    // Interviews
    INTERVIEWS: {
      LIST: '/interviews/',
      CREATE: '/interviews/create',
      DETAIL: (id: string) => `/interviews/${id}/`,
      START: (id: string) => `/interviews/${id}/start/`,
      END: (id: string) => `/interviews/${id}/end/`,
      TRANSCRIPT: (id: string) => `/interviews/${id}/transcript`,
      ASSESSMENT: (id: string) => `/interviews/${id}/assessment`,
    },
    // Training
    TRAINING: {
      MODULES: '/training/modules/',
      LESSONS: '/training/lessons/',
      SESSIONS: '/training/sessions/',
      PROGRESS: '/training/progress/',
      START_SESSION: (id: string) => `/training/modules/${id}/start`,
      END_SESSION: (id: string) => `/training/modules/${id}/end`,
    },
    // Subscription
    SUBSCRIPTIONS: {
      PLANS: '/subscriptions/plans/',
      CURRENT: '/subscriptions/current/',
      UPGRADE: '/subscriptions/upgrade/',
    },
    // Analytics
    ANALYTICS: {
      PROGRESS: '/analytics/progress/',
      USAGE: '/analytics/usage/',
      FEEDBACK: '/analytics/feedback/',
      BADGES: '/analytics/badges/',
      CSAT: '/analytics/csat/',
    },
    // Support
    SUPPORT: {
      FAQS: '/api/support/faqs',
      TICKETS: '/api/support/tickets',
      CHAT: '/api/support/chat/',
      REPORT_PROBLEM: '/api/support/report-problem/',
      CSAT: '/api/support/csat',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};