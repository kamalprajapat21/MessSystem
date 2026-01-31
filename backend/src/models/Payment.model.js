const mongoose = require('mongoose');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../config/constants');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    orderId: String,
    paymentGateway: {
      type: String,
      default: 'razorpay',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    receiptUrl: String,
    invoiceNumber: String,
    paymentDate: Date,
    refundDate: Date,
    refundAmount: Number,
    refundReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ userId: 1, paymentDate: -1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentStatus: 1 });

// Generate invoice number
paymentSchema.pre('save', async function (next) {
  if (!this.invoiceNumber && this.paymentStatus === PAYMENT_STATUS.PAID) {
    const count = await mongoose.models.Payment.countDocuments({
      paymentStatus: PAYMENT_STATUS.PAID,
    });
    this.invoiceNumber = `INV${new Date().getFullYear()}${String(
      count + 1
    ).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
