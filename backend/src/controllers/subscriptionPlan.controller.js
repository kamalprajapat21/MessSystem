const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { ROLES } = require('../config/constants');

// @desc    Get all subscription plans
// @route   GET /api/v1/subscription-plans
// @access  Public
exports.getAllPlans = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const plans = await SubscriptionPlan.find(filter).sort({ price: 1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, { plans, count: plans.length }, 'Plans retrieved successfully')
    );
});

// @desc    Get single subscription plan
// @route   GET /api/v1/subscription-plans/:id
// @access  Public
exports.getPlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, { plan }, 'Plan retrieved successfully'));
});

// @desc    Create subscription plan
// @route   POST /api/v1/subscription-plans
// @access  Private/Admin
exports.createPlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, { plan }, 'Plan created successfully'));
});

// @desc    Update subscription plan
// @route   PUT /api/v1/subscription-plans/:id
// @access  Private/Admin
exports.updatePlan = asyncHandler(async (req, res) => {
  let plan = await SubscriptionPlan.findById(req.params.id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, { plan }, 'Plan updated successfully'));
});

// @desc    Delete subscription plan
// @route   DELETE /api/v1/subscription-plans/:id
// @access  Private/Admin
exports.deletePlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  await plan.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Plan deleted successfully'));
});

// @desc    Toggle plan status
// @route   PATCH /api/v1/subscription-plans/:id/toggle-status
// @access  Private/Admin
exports.togglePlanStatus = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, { plan }, `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`)
    );
});
