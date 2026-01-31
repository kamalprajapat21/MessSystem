const mongoose = require('mongoose');
const crypto = require('crypto');
const { COUPON_STATUS, MEAL_TYPES } = require('../config/constants');

const couponSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    couponCode: {
      type: String,
      unique: true,
      required: true,
    },
    couponNumber: {
      type: Number,
      required: true,
    },
    mealType: {
      type: String,
      enum: Object.values(MEAL_TYPES),
    },
    status: {
      type: String,
      enum: Object.values(COUPON_STATUS),
      default: COUPON_STATUS.AVAILABLE,
    },
    usedAt: Date,
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    usageLocation: String,
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
couponSchema.index({ couponCode: 1 });
couponSchema.index({ subscriptionId: 1, status: 1 });
couponSchema.index({ userId: 1, status: 1 });
couponSchema.index({ status: 1, expiryDate: 1 });

// Generate coupon code
couponSchema.pre('save', function (next) {
  if (!this.couponCode) {
    this.couponCode = `CPN${Date.now()}${crypto
      .randomBytes(6)
      .toString('hex')
      .toUpperCase()}`;
  }
  next();
});

// Methods
couponSchema.methods.markAsUsed = function (staffId, location) {
  this.status = COUPON_STATUS.USED;
  this.usedAt = new Date();
  this.usedBy = staffId;
  this.usageLocation = location;
  return this.save();
};

couponSchema.methods.validate = function () {
  if (this.status !== COUPON_STATUS.AVAILABLE) {
    return { valid: false, message: 'Coupon already used or expired' };
  }
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.status = COUPON_STATUS.EXPIRED;
    this.save();
    return { valid: false, message: 'Coupon has expired' };
  }
  return { valid: true, message: 'Coupon is valid' };
};

module.exports = mongoose.model('Coupon', couponSchema);
