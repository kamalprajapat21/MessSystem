const createEmailTransporter = require('../config/email');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = createEmailTransporter();
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const html = `
      <h1>Email Verification</h1>
      <p>Hello ${user.fullName},</p>
      <p>Thank you for registering with Mess Management System.</p>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <br>
      <p>Best regards,<br>Mess Management Team</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Mess Management System',
      html,
    });
  }

  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const html = `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.fullName},</p>
      <p>You requested to reset your password.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>Mess Management Team</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Password Reset - Mess Management System',
      html,
    });
  }

  async sendSubscriptionConfirmation(user, subscription, plan) {
    const html = `
      <h1>Subscription Confirmed</h1>
      <p>Hello ${user.fullName},</p>
      <p>Your subscription has been confirmed successfully!</p>
      <h3>Subscription Details:</h3>
      <ul>
        <li><strong>Plan:</strong> ${plan.planName}</li>
        <li><strong>Duration:</strong> ${plan.duration} days</li>
        <li><strong>Total Coupons:</strong> ${subscription.totalCoupons}</li>
        <li><strong>Start Date:</strong> ${new Date(subscription.startDate).toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${new Date(subscription.endDate).toLocaleDateString()}</li>
        <li><strong>Amount Paid:</strong> ₹${subscription.amountPaid}</li>
      </ul>
      <p>You can now access your coupons from the mobile app.</p>
      <br>
      <p>Best regards,<br>Mess Management Team</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Subscription Confirmed - Mess Management System',
      html,
    });
  }

  async sendSubscriptionExpiryReminder(user, subscription, daysLeft) {
    const html = `
      <h1>Subscription Expiring Soon</h1>
      <p>Hello ${user.fullName},</p>
      <p>This is a reminder that your mess subscription will expire in <strong>${daysLeft} days</strong>.</p>
      <h3>Subscription Details:</h3>
      <ul>
        <li><strong>Subscription Code:</strong> ${subscription.subscriptionCode}</li>
        <li><strong>Remaining Coupons:</strong> ${subscription.remainingCoupons}</li>
        <li><strong>Expiry Date:</strong> ${new Date(subscription.endDate).toLocaleDateString()}</li>
      </ul>
      <p>Please renew your subscription to continue enjoying mess services.</p>
      <a href="${process.env.FRONTEND_URL}/subscriptions" style="display: inline-block; padding: 10px 20px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px;">Renew Subscription</a>
      <br><br>
      <p>Best regards,<br>Mess Management Team</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: `Subscription Expiring in ${daysLeft} Days - Mess Management System`,
      html,
    });
  }

  async sendPaymentReceipt(user, payment, subscription) {
    const html = `
      <h1>Payment Receipt</h1>
      <p>Hello ${user.fullName},</p>
      <p>Thank you for your payment. Here are the details:</p>
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Invoice Number:</strong> ${payment.invoiceNumber}</li>
        <li><strong>Transaction ID:</strong> ${payment.transactionId}</li>
        <li><strong>Amount:</strong> ₹${payment.amount}</li>
        <li><strong>Payment Method:</strong> ${payment.paymentMethod}</li>
        <li><strong>Date:</strong> ${new Date(payment.paymentDate).toLocaleDateString()}</li>
      </ul>
      <p>Your subscription is now active.</p>
      <br>
      <p>Best regards,<br>Mess Management Team</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Payment Receipt - Mess Management System',
      html,
    });
  }
}

module.exports = new EmailService();
