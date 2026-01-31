const crypto = require('crypto');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const emailService = require('../services/email.service');
const { ROLES } = require('../config/constants');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, role, ...otherFields } = req.body;

  const user = await User.create({
    fullName,
    email,
    mobile,
    password,
    role: role || ROLES.STUDENT,
    ...otherFields,
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email
  await emailService.sendVerificationEmail(user, verificationToken);

  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          studentId: user.studentId,
        },
        token,
        refreshToken,
      },
      'User registered successfully. Please verify your email.'
    )
  );
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Account is deactivated. Please contact admin.');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          studentId: user.studentId,
          isEmailVerified: user.isEmailVerified,
        },
        token,
        refreshToken,
      },
      'Login successful'
    )
  );
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          studentId: user.studentId,
          profilePicture: user.profilePicture,
          isEmailVerified: user.isEmailVerified,
          department: user.department,
          year: user.year,
          hostelName: user.hostelName,
          roomNumber: user.roomNumber,
        },
      },
      'User profile retrieved successfully'
    )
  );
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    fullName: req.body.fullName,
    mobile: req.body.mobile,
    department: req.body.department,
    year: req.body.year,
    hostelName: req.body.hostelName,
    roomNumber: req.body.roomNumber,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { user }, 'Profile updated successfully'));
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ApiError(404, 'User not found with this email');
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  await emailService.sendPasswordResetEmail(user, resetToken);

  res
    .status(200)
    .json(
      new ApiResponse(200, null, 'Password reset email sent successfully')
    );
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Password reset successfully'));
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: emailVerificationToken,
  });

  if (!user) {
    throw new ApiError(400, 'Invalid verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Email verified successfully'));
});

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const newToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token: newToken,
          refreshToken: newRefreshToken,
        },
        'Token refreshed successfully'
      )
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});
