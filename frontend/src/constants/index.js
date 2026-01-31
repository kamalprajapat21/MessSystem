// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api/v1';

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  STAFF: 'staff',
};

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Coupon Status
export const COUPON_STATUS = {
  AVAILABLE: 'available',
  USED: 'used',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};

// Meal Types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: '@token',
  USER: '@user',
  REFRESH_TOKEN: '@refreshToken',
};
