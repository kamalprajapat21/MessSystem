# Mess Management System - Backend

Complete Node.js + Express.js backend API for managing mess subscriptions, coupons, and meal attendance.

## 🚀 Features

- ✅ JWT Authentication & Authorization
- ✅ Role-Based Access Control (Admin, Staff, Student)
- ✅ Subscription Management
- ✅ Automated Coupon Generation
- ✅ QR Code Generation & Scanning
- ✅ Payment Integration (Razorpay)
- ✅ Email Notifications
- ✅ Redis Caching
- ✅ Rate Limiting
- ✅ Input Validation & Sanitization
- ✅ Error Handling & Logging
- ✅ API Documentation

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- Redis >= 6.x (optional, for caching)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/mess_management

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@messsystem.com
EMAIL_FROM_NAME=Mess Management System
SENDGRID_API_KEY=your-sendgrid-api-key

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@messsystem.com
ADMIN_PASSWORD=Admin@123
```

### 3. Database Setup

Make sure MongoDB is running, then seed the database with initial data:

```bash
npm run seed
```

This will create:
- Admin user
- Staff user
- Sample student
- Subscription plans

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Production Mode

```bash
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "Password@123",
  "role": "student",
  "department": "Computer Science",
  "year": "3rd Year"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

### Subscription Plans

#### Get All Plans
```http
GET /subscription-plans
```

#### Create Plan (Admin Only)
```http
POST /subscription-plans
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "planName": "Basic Plan - 30 Days",
  "description": "Monthly meal plan",
  "duration": 30,
  "totalCoupons": 60,
  "price": 3000,
  "mealType": ["lunch", "dinner"],
  "mealsPerDay": 2
}
```

### Subscriptions

#### Create Subscription
```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "plan_id_here",
  "startDate": "2024-01-01",
  "paymentMethod": "upi"
}
```

#### Get My Subscriptions
```http
GET /subscriptions/my-subscriptions
Authorization: Bearer <token>
```

### Coupons

#### Get My Coupons
```http
GET /coupons/my-coupons
Authorization: Bearer <token>
```

#### Get Coupon with QR Code
```http
GET /coupons/:id
Authorization: Bearer <token>
```

#### Scan QR Code (Staff)
```http
POST /coupons/scan-qr
Authorization: Bearer <staff-token>
Content-Type: application/json

{
  "qrData": "{\"couponCode\":\"CPN123...\"}",
  "mealType": "lunch",
  "messLocation": "Main Mess"
}
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── email.js
│   │   ├── cloudinary.js
│   │   └── constants.js
│   ├── models/          # Database models
│   │   ├── User.model.js
│   │   ├── SubscriptionPlan.model.js
│   │   ├── Subscription.model.js
│   │   ├── Coupon.model.js
│   │   ├── Payment.model.js
│   │   ├── MealAttendance.model.js
│   │   ├── Notification.model.js
│   │   └── AuditLog.model.js
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.js
│   │   ├── subscriptionPlan.controller.js
│   │   ├── subscription.controller.js
│   │   └── coupon.controller.js
│   ├── routes/          # API routes
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── subscriptionPlan.routes.js
│   │   ├── subscription.routes.js
│   │   └── coupon.routes.js
│   ├── middlewares/     # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── validate.middleware.js
│   ├── services/        # Business logic
│   │   └── email.service.js
│   ├── utils/           # Helper functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── logger.js
│   ├── seeders/         # Database seeders
│   │   └── index.js
│   └── app.js           # Express app
├── tests/               # Test files
├── logs/                # Log files
├── .env.example         # Environment variables template
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── server.js            # Entry point
└── README.md
```

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with initial data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔒 Security Features

- ✅ Helmet for security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input sanitization (mongo-sanitize, xss-clean)
- ✅ HPP (HTTP Parameter Pollution) protection
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Request validation

## 📊 Database Models

### User
- Authentication & authorization
- Student, Staff, Admin roles
- Profile management

### SubscriptionPlan
- Different meal plans
- Pricing & duration
- Coupon allocation

### Subscription
- User subscriptions
- Payment tracking
- Coupon count management

### Coupon
- Individual meal coupons
- QR code generation
- Usage tracking

### MealAttendance
- Meal consumption tracking
- Verification logs

### Payment
- Payment transactions
- Invoice generation

### Notification
- Email notifications
- Push notifications

### AuditLog
- System activity tracking
- Security logging

## 🚧 Default Credentials

After running `npm run seed`:

**Admin:**
- Email: admin@messsystem.com
- Password: Admin@123

**Staff:**
- Email: staff@messsystem.com
- Password: Staff@123

**Student:**
- Email: student@messsystem.com
- Password: Student@123

⚠️ **Change these credentials in production!**

## 🐛 Error Handling

The API uses a centralized error handling mechanism:

```javascript
// Operational errors
throw new ApiError(404, 'Resource not found');

// Unhandled errors are caught by global error handler
```

## 📈 Logging

Winston logger is used for logging:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- Console output in development mode

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

## 🌟 Best Practices

- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Implement proper error handling
- Add input validation
- Use environment variables for configuration
- Log important events
- Follow security best practices

## 📞 Support

For issues or questions, please open an issue in the repository.

## 📄 License

MIT
