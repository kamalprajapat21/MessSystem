const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

router.use(protect);

// Student routes
router.post('/', subscriptionController.createSubscription);
router.get('/my-subscriptions', subscriptionController.getMySubscriptions);
router.get('/:id', subscriptionController.getSubscription);
router.patch('/:id/cancel', subscriptionController.cancelSubscription);

// Admin routes
router.get(
  '/',
  authorize(ROLES.ADMIN),
  subscriptionController.getAllSubscriptions
);
router.patch(
  '/:id/status',
  authorize(ROLES.ADMIN),
  subscriptionController.updateSubscriptionStatus
);
router.get(
  '/stats/overview',
  authorize(ROLES.ADMIN),
  subscriptionController.getSubscriptionStats
);

module.exports = router;
