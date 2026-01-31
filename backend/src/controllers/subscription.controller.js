const Subscription = require('../models/Subscription.model');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const Coupon = require('../models/Coupon.model');
const Payment = require('../models/Payment.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const {
  SUBSCRIPTION_STATUS,
  PAYMENT_STATUS,
  COUPON_STATUS,
  ROLES,
} = require('../config/constants');

// @desc    Create new subscription
// @route   POST /api/v1/subscriptions
// @access  Private
exports.createSubscription = asyncHandler(async (req, res) => {
  const { planId, startDate, paymentMethod } = req.body;
  const userId = req.user.id;

  // Get the subscription plan
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan || !plan.isActive) {
    throw new ApiError(404, 'Subscription plan not found or inactive');
  }

  // Calculate end date
  const start = new Date(startDate || Date.now());
  const end = new Date(start);
  end.setDate(end.getDate() + plan.duration);

  // Create subscription
  const subscription = await Subscription.create({
    userId,
    planId,
    startDate: start,
    endDate: end,
    totalCoupons: plan.totalCoupons,
    remainingCoupons: plan.totalCoupons,
    amountPaid: plan.price,
    paymentMethod,
    status: SUBSCRIPTION_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PENDING,
  });

  // Generate coupons
  const coupons = [];
  for (let i = 1; i <= plan.totalCoupons; i++) {
    coupons.push({
      subscriptionId: subscription._id,
      userId,
      couponNumber: i,
      status: COUPON_STATUS.AVAILABLE,
      expiryDate: end,
    });
  }

  await Coupon.insertMany(coupons);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { subscription },
        'Subscription created successfully. Please complete payment.'
      )
    );
});

// @desc    Get user subscriptions
// @route   GET /api/v1/subscriptions/my-subscriptions
// @access  Private
exports.getMySubscriptions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { userId: req.user.id };

  if (status) {
    filter.status = status;
  }

  const subscriptions = await Subscription.find(filter)
    .populate('planId', 'planName duration price mealType')
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriptions, count: subscriptions.length },
        'Subscriptions retrieved successfully'
      )
    );
});

// @desc    Get single subscription
// @route   GET /api/v1/subscriptions/:id
// @access  Private
exports.getSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id)
    .populate('userId', 'fullName email studentId')
    .populate('planId', 'planName duration price mealType');

  if (!subscription) {
    throw new ApiError(404, 'Subscription not found');
  }

  // Check if user is authorized to view this subscription
  if (
    subscription.userId._id.toString() !== req.user.id &&
    req.user.role !== ROLES.ADMIN
  ) {
    throw new ApiError(403, 'Not authorized to access this subscription');
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { subscription }, 'Subscription retrieved successfully')
    );
});

// @desc    Get all subscriptions (Admin)
// @route   GET /api/v1/subscriptions
// @access  Private/Admin
exports.getAllSubscriptions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  let query = Subscription.find(filter)
    .populate('userId', 'fullName email studentId mobile')
    .populate('planId', 'planName duration price');

  // Search by student ID or name
  if (search) {
    const users = await User.find({
      $or: [
        { studentId: new RegExp(search, 'i') },
        { fullName: new RegExp(search, 'i') },
      ],
    }).select('_id');

    const userIds = users.map((user) => user._id);
    query = query.where('userId').in(userIds);
  }

  // Pagination
  const skip = (page - 1) * limit;
  const total = await Subscription.countDocuments(filter);

  const subscriptions = await query.skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        subscriptions,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
      'Subscriptions retrieved successfully'
    )
  );
});

// @desc    Update subscription status
// @route   PATCH /api/v1/subscriptions/:id/status
// @access  Private/Admin
exports.updateSubscriptionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    throw new ApiError(404, 'Subscription not found');
  }

  subscription.status = status;
  await subscription.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, { subscription }, 'Subscription status updated successfully')
    );
});

// @desc    Cancel subscription
// @route   PATCH /api/v1/subscriptions/:id/cancel
// @access  Private
exports.cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    throw new ApiError(404, 'Subscription not found');
  }

  // Check authorization
  if (
    subscription.userId.toString() !== req.user.id &&
    req.user.role !== ROLES.ADMIN
  ) {
    throw new ApiError(403, 'Not authorized to cancel this subscription');
  }

  if (subscription.status === SUBSCRIPTION_STATUS.CANCELLED) {
    throw new ApiError(400, 'Subscription already cancelled');
  }

  subscription.status = SUBSCRIPTION_STATUS.CANCELLED;
  subscription.isActive = false;
  await subscription.save();

  // Mark all unused coupons as cancelled
  await Coupon.updateMany(
    {
      subscriptionId: subscription._id,
      status: COUPON_STATUS.AVAILABLE,
    },
    {
      status: COUPON_STATUS.CANCELLED,
    }
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, { subscription }, 'Subscription cancelled successfully')
    );
});

// @desc    Get subscription statistics
// @route   GET /api/v1/subscriptions/stats/overview
// @access  Private/Admin
exports.getSubscriptionStats = asyncHandler(async (req, res) => {
  const stats = await Subscription.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$amountPaid' },
      },
    },
  ]);

  const totalSubscriptions = await Subscription.countDocuments();
  const activeSubscriptions = await Subscription.countDocuments({
    status: SUBSCRIPTION_STATUS.ACTIVE,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        stats,
        totalSubscriptions,
        activeSubscriptions,
      },
      'Statistics retrieved successfully'
    )
  );
});
