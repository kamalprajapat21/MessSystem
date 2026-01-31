module.exports = {
  ROLES: {
    ADMIN: 'admin',
    STUDENT: 'student',
    STAFF: 'staff',
  },

  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
  },

  PAYMENT_STATUS: {
    PAID: 'paid',
    PENDING: 'pending',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  PAYMENT_METHODS: {
    CASH: 'cash',
    UPI: 'upi',
    CARD: 'card',
    NETBANKING: 'netbanking',
  },

  COUPON_STATUS: {
    AVAILABLE: 'available',
    USED: 'used',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
  },

  MEAL_TYPES: {
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    DINNER: 'dinner',
  },

  NOTIFICATION_TYPES: {
    EMAIL: 'email',
    PUSH: 'push',
    SMS: 'sms',
  },

  NOTIFICATION_CATEGORIES: {
    SUBSCRIPTION_EXPIRY: 'subscription_expiry',
    PAYMENT: 'payment',
    COUPON: 'coupon',
    ANNOUNCEMENT: 'announcement',
  },
};
