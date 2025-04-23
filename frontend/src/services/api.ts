import axios from 'axios';
import { API_CONFIG } from '@/config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken });
        const { token } = response.data;
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData: any) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
};

export const userService = {
  getProfile: () => api.get(API_CONFIG.ENDPOINTS.USER.PROFILE),
  updateProfile: (data: any) =>
    api.put(API_CONFIG.ENDPOINTS.USER.UPDATE, data),
  deleteAccount: () => api.delete(API_CONFIG.ENDPOINTS.USER.DELETE),
};

export const interviewService = {
  listInterviews: () => api.get(API_CONFIG.ENDPOINTS.INTERVIEWS.LIST),
  createInterview: (data: any) =>
    api.post(API_CONFIG.ENDPOINTS.INTERVIEWS.CREATE, data),
  getInterview: (id: string) =>
    api.get(API_CONFIG.ENDPOINTS.INTERVIEWS.DETAIL(id)),
  startInterview: (id: string) =>
    api.post(API_CONFIG.ENDPOINTS.INTERVIEWS.START(id)),
  endInterview: (id: string) =>
    api.post(API_CONFIG.ENDPOINTS.INTERVIEWS.END(id)),
  getTranscript: (id: string) =>
    api.get(API_CONFIG.ENDPOINTS.INTERVIEWS.TRANSCRIPT(id)),
  getAssessment: (id: string) =>
    api.get(API_CONFIG.ENDPOINTS.INTERVIEWS.ASSESSMENT(id)),
};

export const trainingService = {
  listModules: () => api.get(API_CONFIG.ENDPOINTS.TRAINING.MODULES),
  getModule: (id: string) =>
    api.get(API_CONFIG.ENDPOINTS.TRAINING.MODULE_DETAIL(id)),
  getProgress: () => api.get(API_CONFIG.ENDPOINTS.TRAINING.PROGRESS),
  startSession: (id: string) =>
    api.post(API_CONFIG.ENDPOINTS.TRAINING.START_SESSION(id)),
  endSession: (id: string) =>
    api.post(API_CONFIG.ENDPOINTS.TRAINING.END_SESSION(id)),
};

export const subscriptionService = {
  getPlans: () => api.get(API_CONFIG.ENDPOINTS.SUBSCRIPTION.PLANS),
  subscribe: (planId: string) =>
    api.post(API_CONFIG.ENDPOINTS.SUBSCRIPTION.SUBSCRIBE, { planId }),
  cancel: () => api.post(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CANCEL),
  getInvoices: () => api.get(API_CONFIG.ENDPOINTS.SUBSCRIPTION.INVOICES),
};

export const analyticsService = {
  getProgress: () => api.get(API_CONFIG.ENDPOINTS.ANALYTICS.PROGRESS),
  getUsage: () => api.get(API_CONFIG.ENDPOINTS.ANALYTICS.USAGE),
  submitFeedback: (data: any) => api.post(API_CONFIG.ENDPOINTS.ANALYTICS.FEEDBACK, data),
  shareBadge: (badgeId: string) => api.post(`${API_CONFIG.ENDPOINTS.ANALYTICS.BADGES}/${badgeId}/share`),
  submitCsat: (rating: number, feedback: string) => api.post(API_CONFIG.ENDPOINTS.ANALYTICS.CSAT, {
    rating,
    feedback
  })
};

export const supportService = {
  getFaqs: () => api.get(API_CONFIG.ENDPOINTS.SUPPORT.FAQS),
  getFaqsByCategory: () => api.get(`${API_CONFIG.ENDPOINTS.SUPPORT.FAQS}/by_category/`),
  getTickets: () => api.get(API_CONFIG.ENDPOINTS.SUPPORT.TICKETS),
  getTicket: (id: string) => api.get(`${API_CONFIG.ENDPOINTS.SUPPORT.TICKETS}/${id}/`),
  createTicket: (data: any) => api.post(API_CONFIG.ENDPOINTS.SUPPORT.TICKETS, data),
  resolveTicket: (id: string) => api.post(`${API_CONFIG.ENDPOINTS.SUPPORT.TICKETS}/${id}/resolve/`),
  sendChatMessage: (data: { message: string; session_id?: string; url?: string; browser_info?: string }) =>
    api.post(API_CONFIG.ENDPOINTS.SUPPORT.CHAT, data),
  reportProblem: (data: { session_id: string; transcript_snippet: string; console_log: string }) =>
    api.post(API_CONFIG.ENDPOINTS.SUPPORT.REPORT_PROBLEM, data),
  submitCsatRating: (data: { rating: number; feedback?: string; ticket?: string; chat_interaction?: string }) =>
    api.post(API_CONFIG.ENDPOINTS.SUPPORT.CSAT, data),
};

export default api;