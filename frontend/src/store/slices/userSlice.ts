import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services/api';

interface UserState {
  profile: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProfile, setLoading, setError } = userSlice.actions;

// Thunks
export const fetchProfile = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await userService.getProfile();
    dispatch(setProfile(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch profile'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProfile = (data: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await userService.updateProfile(data);
    dispatch(setProfile(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update profile'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteAccount = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    await userService.deleteAccount();
    dispatch(setProfile(null));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete account'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer; 