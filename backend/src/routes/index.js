const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth.routes');
const subscriptionPlanRoutes = require('./subscriptionPlan.routes');
const subscriptionRoutes = require('./subscription.routes');
const couponRoutes = require('./coupon.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/subscription-plans', subscriptionPlanRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/coupons', couponRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
