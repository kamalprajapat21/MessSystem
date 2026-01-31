const mongoose = require('mongoose');
const crypto = require('crypto');
const {
  SUBSCRIPTION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
} = require('../config/constants');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    subscriptionCode: {
      type: String,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.PENDING,
    },
    totalCoupons: {
      type: Number,
      required: true,
    },
    usedCoupons: {
      type: Number,
      default: 0,
    },
    remainingCoupons: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    transactionId: String,
    paymentDate: Date,
    autoRenew: {
      type: Boolean,
      default: false,
    },
    remindersSent: {
      sevenDays: { type: Boolean, default: false },
      threeDays: { type: Boolean, default: false },
      onExpiry: { type: Boolean, default: false },
    },
    lastReminderSent: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });
subscriptionSchema.index({ subscriptionCode: 1 });
subscriptionSchema.index({ status: 1 });

// Generate subscription code
subscriptionSchema.pre('save', function (next) {
  if (!this.subscriptionCode) {
    this.subscriptionCode = `SUB${Date.now()}${crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()}`;
  }
  this.remainingCoupons = this.totalCoupons - this.usedCoupons;
  next();
});

// Methods
subscriptionSchema.methods.updateCouponCount = function () {
  this.remainingCoupons = this.totalCoupons - this.usedCoupons;
  return this.save();
};

subscriptionSchema.methods.checkExpiry = function () {
  if (new Date() > this.endDate && this.status === SUBSCRIPTION_STATUS.ACTIVE) {
    this.status = SUBSCRIPTION_STATUS.EXPIRED;
    this.isActive = false;
    return this.save();
  }
  return this;
};

subscriptionSchema.methods.extendSubscription = function (days) {
  this.endDate = new Date(this.endDate.getTime() + days * 24 * 60 * 60 * 1000);
  return this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
