import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponService from '../../services/couponService';

// Thunks
export const fetchMyCoupons = createAsyncThunk(
  'coupon/fetchMyCoupons',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await couponService.getMyCoupons(filters);
      return response.data.coupons;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coupons');
    }
  }
);

export const fetchCouponWithQR = createAsyncThunk(
  'coupon/fetchCouponWithQR',
  async (id, { rejectWithValue }) => {
    try {
      const response = await couponService.getCoupon(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coupon');
    }
  }
);

// Slice
const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupons: [],
    currentCoupon: null,
    qrCode: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCurrentCoupon: state => {
      state.currentCoupon = null;
      state.qrCode = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Coupons
      .addCase(fetchMyCoupons.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMyCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchMyCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Coupon with QR
      .addCase(fetchCouponWithQR.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCouponWithQR.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload.coupon;
        state.qrCode = action.payload.qrCode;
      })
      .addCase(fetchCouponWithQR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCoupon } = couponSlice.actions;
export default couponSlice.reducer;
