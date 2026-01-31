const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controllers/subscriptionPlan.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

// Public routes
router.get('/', subscriptionPlanController.getAllPlans);
router.get('/:id', subscriptionPlanController.getPlan);

// Admin only routes
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.post('/', subscriptionPlanController.createPlan);
router.put('/:id', subscriptionPlanController.updatePlan);
router.delete('/:id', subscriptionPlanController.deletePlan);
router.patch('/:id/toggle-status', subscriptionPlanController.togglePlanStatus);

module.exports = router;
