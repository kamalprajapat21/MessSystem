const mongoose = require('mongoose');
const { MEAL_TYPES } = require('../config/constants');

const mealAttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mealType: {
      type: String,
      enum: Object.values(MEAL_TYPES),
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messLocation: {
      type: String,
      default: 'Main Mess',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
mealAttendanceSchema.index({ userId: 1, date: -1 });
mealAttendanceSchema.index({ date: -1, mealType: 1 });
mealAttendanceSchema.index({ subscriptionId: 1 });

module.exports = mongoose.model('MealAttendance', mealAttendanceSchema);
