import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionService from '../../services/subscriptionService';

// Thunks
export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getAllPlans();
      return response.data.plans;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch plans');
    }
  }
);

export const fetchMySubscriptions = createAsyncThunk(
  'subscription/fetchMySubscriptions',
  async (status, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getMySubscriptions(status);
      return response.data.subscriptions;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch subscriptions');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.createSubscription(data);
      return response.data.subscription;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create subscription');
    }
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    plans: [],
    mySubscriptions: [],
    currentSubscription: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Subscriptions
      .addCase(fetchMySubscriptions.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMySubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubscriptions = action.payload;
      })
      .addCase(fetchMySubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Subscription
      .addCase(createSubscription.pending, state => {
        state.loading = true;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubscriptions.push(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
