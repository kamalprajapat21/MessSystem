const Coupon = require('../models/Coupon.model');
const Subscription = require('../models/Subscription.model');
const MealAttendance = require('../models/MealAttendance.model');
const QRCode = require('qrcode');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { COUPON_STATUS, SUBSCRIPTION_STATUS, ROLES } = require('../config/constants');

// @desc    Get user coupons
// @route   GET /api/v1/coupons/my-coupons
// @access  Private
exports.getMyCoupons = asyncHandler(async (req, res) => {
  const { status, subscriptionId } = req.query;
  const filter = { userId: req.user.id };

  if (status) {
    filter.status = status;
  }

  if (subscriptionId) {
    filter.subscriptionId = subscriptionId;
  }

  const coupons = await Coupon.find(filter)
    .populate('subscriptionId', 'subscriptionCode planId startDate endDate')
    .sort({ couponNumber: 1 });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { coupons, count: coupons.length },
        'Coupons retrieved successfully'
      )
    );
});

// @desc    Get single coupon with QR code
// @route   GET /api/v1/coupons/:id
// @access  Private
exports.getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate('userId', 'fullName email studentId')
    .populate('subscriptionId', 'subscriptionCode planId');

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  // Check authorization
  if (
    coupon.userId._id.toString() !== req.user.id &&
    req.user.role !== ROLES.ADMIN &&
    req.user.role !== ROLES.STAFF
  ) {
    throw new ApiError(403, 'Not authorized to access this coupon');
  }

  // Generate QR code
  const qrData = {
    couponId: coupon._id,
    couponCode: coupon.couponCode,
    userId: coupon.userId._id,
    studentId: coupon.userId.studentId,
  };

  const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        coupon,
        qrCode: qrCodeUrl,
      },
      'Coupon retrieved successfully'
    )
  );
});

// @desc    Validate and use coupon (Staff)
// @route   POST /api/v1/coupons/validate
// @access  Private/Staff
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { couponCode, mealType, messLocation } = req.body;

  const coupon = await Coupon.findOne({ couponCode })
    .populate('userId', 'fullName studentId email')
    .populate('subscriptionId', 'status endDate');

  if (!coupon) {
    throw new ApiError(404, 'Invalid coupon code');
  }

  // Validate coupon
  const validation = coupon.validate();
  if (!validation.valid) {
    throw new ApiError(400, validation.message);
  }

  // Check subscription status
  if (coupon.subscriptionId.status !== SUBSCRIPTION_STATUS.ACTIVE) {
    throw new ApiError(400, 'Subscription is not active');
  }

  // Mark coupon as used
  await coupon.markAsUsed(req.user.id, messLocation);

  // Update subscription coupon count
  const subscription = await Subscription.findById(coupon.subscriptionId._id);
  subscription.usedCoupons += 1;
  await subscription.updateCouponCount();

  // Record meal attendance
  await MealAttendance.create({
    userId: coupon.userId._id,
    subscriptionId: coupon.subscriptionId._id,
    couponId: coupon._id,
    mealType,
    verifiedBy: req.user.id,
    messLocation,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        coupon,
        student: coupon.userId,
        message: 'Coupon validated successfully',
      },
      'Coupon used successfully'
    )
  );
});

// @desc    Scan QR code and validate
// @route   POST /api/v1/coupons/scan-qr
// @access  Private/Staff
exports.scanQRCode = asyncHandler(async (req, res) => {
  const { qrData, mealType, messLocation } = req.body;

  let parsedData;
  try {
    parsedData = JSON.parse(qrData);
  } catch (error) {
    throw new ApiError(400, 'Invalid QR code data');
  }

  const { couponCode } = parsedData;

  const coupon = await Coupon.findOne({ couponCode })
    .populate('userId', 'fullName studentId email profilePicture')
    .populate('subscriptionId', 'status endDate remainingCoupons');

  if (!coupon) {
    throw new ApiError(404, 'Invalid coupon');
  }

  // Validate coupon
  const validation = coupon.validate();
  if (!validation.valid) {
    throw new ApiError(400, validation.message);
  }

  // Check subscription
  if (coupon.subscriptionId.status !== SUBSCRIPTION_STATUS.ACTIVE) {
    throw new ApiError(400, 'Subscription is not active');
  }

  // Mark as used
  await coupon.markAsUsed(req.user.id, messLocation);

  // Update subscription
  const subscription = await Subscription.findById(coupon.subscriptionId._id);
  subscription.usedCoupons += 1;
  await subscription.updateCouponCount();

  // Record attendance
  await MealAttendance.create({
    userId: coupon.userId._id,
    subscriptionId: coupon.subscriptionId._id,
    couponId: coupon._id,
    mealType,
    verifiedBy: req.user.id,
    messLocation,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        success: true,
        student: coupon.userId,
        coupon: {
          couponCode: coupon.couponCode,
          couponNumber: coupon.couponNumber,
        },
        subscription: {
          remainingCoupons: subscription.remainingCoupons,
          endDate: subscription.endDate,
        },
      },
      'QR code scanned and coupon validated successfully'
    )
  );
});

// @desc    Get coupon usage stats
// @route   GET /api/v1/coupons/stats/usage
// @access  Private/Admin
exports.getCouponStats = asyncHandler(async (req, res) => {
  const totalCoupons = await Coupon.countDocuments();
  const usedCoupons = await Coupon.countDocuments({ status: COUPON_STATUS.USED });
  const availableCoupons = await Coupon.countDocuments({
    status: COUPON_STATUS.AVAILABLE,
  });
  const expiredCoupons = await Coupon.countDocuments({
    status: COUPON_STATUS.EXPIRED,
  });

  const todayUsage = await MealAttendance.countDocuments({
    date: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCoupons,
        usedCoupons,
        availableCoupons,
        expiredCoupons,
        todayUsage,
        usageRate: ((usedCoupons / totalCoupons) * 100).toFixed(2) + '%',
      },
      'Coupon statistics retrieved successfully'
    )
  );
});
