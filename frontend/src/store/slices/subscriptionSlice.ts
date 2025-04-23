import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { subscriptionService } from '@/services/api';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: 'monthly' | 'yearly';
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  invoices: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  currentPlan: null,
  invoices: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<SubscriptionPlan[]>) => {
      state.plans = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<SubscriptionPlan | null>) => {
      state.currentPlan = action.payload;
    },
    setInvoices: (state, action: PayloadAction<any[]>) => {
      state.invoices = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlans,
  setCurrentPlan,
  setInvoices,
  setLoading,
  setError,
} = subscriptionSlice.actions;

// Thunks
export const fetchPlans = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await subscriptionService.getPlans();
    dispatch(setPlans(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch plans'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const subscribe = (planId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await subscriptionService.subscribe(planId);
    dispatch(setCurrentPlan(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to subscribe'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const cancelSubscription = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    await subscriptionService.cancel();
    dispatch(setCurrentPlan(null));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to cancel subscription'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchInvoices = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await subscriptionService.getInvoices();
    dispatch(setInvoices(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch invoices'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default subscriptionSlice.reducer; 