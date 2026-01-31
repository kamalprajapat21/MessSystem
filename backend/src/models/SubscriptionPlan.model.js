const mongoose = require('mongoose');
const { MEAL_TYPES } = require('../config/constants');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, 'Please provide plan name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide plan description'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide duration in days'],
      min: [1, 'Duration must be at least 1 day'],
    },
    totalCoupons: {
      type: Number,
      required: [true, 'Please provide total coupons'],
      min: [1, 'Total coupons must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    mealType: {
      type: [String],
      enum: Object.values(MEAL_TYPES),
      default: [MEAL_TYPES.LUNCH, MEAL_TYPES.DINNER],
    },
    mealsPerDay: {
      type: Number,
      default: 2,
      min: 1,
      max: 3,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionPlanSchema.index({ isActive: 1 });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
