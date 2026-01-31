const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

router.use(protect);

// Student routes
router.get('/my-coupons', couponController.getMyCoupons);
router.get('/:id', couponController.getCoupon);

// Staff routes
router.post(
  '/validate',
  authorize(ROLES.STAFF, ROLES.ADMIN),
  couponController.validateCoupon
);
router.post(
  '/scan-qr',
  authorize(ROLES.STAFF, ROLES.ADMIN),
  couponController.scanQRCode
);

// Admin routes
router.get(
  '/stats/usage',
  authorize(ROLES.ADMIN),
  couponController.getCouponStats
);

module.exports = router;
