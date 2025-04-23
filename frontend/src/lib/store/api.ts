import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from './slices/authSlice';
import type { InterviewSession, InterviewConfig } from './slices/interviewSlice';
import type { TrainingModule } from './slices/trainingSlice';

// Define base types for API responses
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

// Create the API service
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Interview', 'Training'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      ApiResponse<{ user: User; token: string }>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Interview endpoints
    startInterview: builder.mutation<ApiResponse<InterviewSession>, InterviewConfig>({
      query: (config) => ({
        url: '/interviews/start',
        method: 'POST',
        body: config,
      }),
      invalidatesTags: ['Interview'],
    }),

    getInterviews: builder.query<ApiResponse<InterviewSession[]>, void>({
      query: () => '/interviews',
      providesTags: ['Interview'],
    }),

    // Training endpoints
    getTrainingModules: builder.query<ApiResponse<TrainingModule[]>, void>({
      query: () => '/training/modules',
      providesTags: ['Training'],
    }),

    updateModuleProgress: builder.mutation<
      ApiResponse<void>,
      { moduleId: string; lessonId: string }
    >({
      query: ({ moduleId, lessonId }) => ({
        url: `/training/modules/${moduleId}/lessons/${lessonId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Training'],
    }),

    // User management endpoints
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Subscription management
    createSubscription: builder.mutation<
      ApiResponse<{ subscriptionId: string }>,
      { priceId: string }
    >({
      query: (data) => ({
        url: '/subscriptions/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useStartInterviewMutation,
  useGetInterviewsQuery,
  useGetTrainingModulesQuery,
  useUpdateModuleProgressMutation,
  useUpdateProfileMutation,
  useCreateSubscriptionMutation,
} = api;