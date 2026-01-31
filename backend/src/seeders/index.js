require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User.model');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const logger = require('../utils/logger');
const { ROLES, MEAL_TYPES } = require('../config/constants');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await SubscriptionPlan.deleteMany();

    logger.info('Existing data cleared');

    // Create admin user
    const admin = await User.create({
      fullName: 'System Admin',
      email: process.env.ADMIN_EMAIL || 'admin@messsystem.com',
      mobile: '9999999999',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: ROLES.ADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    logger.info('Admin user created');

    // Create staff user
    const staff = await User.create({
      fullName: 'Mess Staff',
      email: 'staff@messsystem.com',
      mobile: '8888888888',
      password: 'Staff@123',
      role: ROLES.STAFF,
      isEmailVerified: true,
      isActive: true,
    });

    logger.info('Staff user created');

    // Create sample subscription plans
    const plans = [
      {
        planName: 'Basic Plan - 30 Days',
        description: 'Perfect for students who want a monthly meal plan with 60 meals',
        duration: 30,
        totalCoupons: 60,
        price: 3000,
        mealType: [MEAL_TYPES.LUNCH, MEAL_TYPES.DINNER],
        mealsPerDay: 2,
        isActive: true,
        features: ['2 meals per day', 'Valid for 30 days', 'Main mess only'],
      },
      {
        planName: 'Standard Plan - 30 Days',
        description: 'Comprehensive meal plan with all three meals',
        duration: 30,
        totalCoupons: 90,
        price: 4500,
        mealType: [MEAL_TYPES.BREAKFAST, MEAL_TYPES.LUNCH, MEAL_TYPES.DINNER],
        mealsPerDay: 3,
        isActive: true,
        features: ['3 meals per day', 'Valid for 30 days', 'All mess locations'],
      },
      {
        planName: 'Premium Plan - 90 Days',
        description: 'Best value quarterly plan with all meals',
        duration: 90,
        totalCoupons: 270,
        price: 12000,
        mealType: [MEAL_TYPES.BREAKFAST, MEAL_TYPES.LUNCH, MEAL_TYPES.DINNER],
        mealsPerDay: 3,
        isActive: true,
        features: [
          '3 meals per day',
          'Valid for 90 days',
          'All mess locations',
          'Priority service',
          'Save 10%',
        ],
      },
      {
        planName: 'Weekend Plan - 30 Days',
        description: 'Perfect for day scholars who need weekend meals',
        duration: 30,
        totalCoupons: 24,
        price: 1500,
        mealType: [MEAL_TYPES.LUNCH, MEAL_TYPES.DINNER],
        mealsPerDay: 2,
        isActive: true,
        features: ['Weekend only', '2 meals per day', 'Flexible timing'],
      },
    ];

    await SubscriptionPlan.insertMany(plans);
    logger.info('Subscription plans created');

    // Create sample student
    const student = await User.create({
      fullName: 'John Doe',
      email: 'student@messsystem.com',
      mobile: '7777777777',
      password: 'Student@123',
      role: ROLES.STUDENT,
      isEmailVerified: true,
      isActive: true,
      department: 'Computer Science',
      year: '3rd Year',
      hostelName: 'Hostel A',
      roomNumber: '301',
    });

    logger.info('Sample student created');

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================\n');
    console.log('Login Credentials:');
    console.log('\nAdmin:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('\nStaff:');
    console.log(`Email: ${staff.email}`);
    console.log('Password: Staff@123');
    console.log('\nStudent:');
    console.log(`Email: ${student.email}`);
    console.log('Password: Student@123');
    console.log('\n========================================\n');

    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
