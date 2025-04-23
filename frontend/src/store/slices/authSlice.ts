import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/api';

export interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    subscription: {
      type: string;
      status: string;
      expiresAt: string;
    };
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setCredentials, setLoading, setError, logout } = authSlice.actions;

// Thunks
export const login = (credentials: { email: string; password: string }) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.login(credentials);
    dispatch(setCredentials(response.data));
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Login failed'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const register = (userData: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.register(userData);
    dispatch(setCredentials(response.data));
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Registration failed'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await authService.logout();
  } finally {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

export default authSlice.reducer; 