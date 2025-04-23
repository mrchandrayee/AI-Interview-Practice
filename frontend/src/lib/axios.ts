import axios from 'axios';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for handling authentication cookies
});

// Add request interceptor for authentication
instance.interceptors.request.use((config) => {
  // You could add auth tokens here if using token-based auth
  return config;
});

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { instance as axios };