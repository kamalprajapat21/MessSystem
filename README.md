# Mess Management System

A complete, production-ready Mess Management Mobile Application for managing 500+ students with subscription-based coupon system.

## 🚀 Tech Stack

- **Frontend**: React Native
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Cache**: Redis
- **Additional**: Email Notifications, QR Code System, Payment Gateway (Razorpay)

## 📁 Project Structure

```
MessSystem/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── frontend/         # React Native Mobile App
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── redux/
│   │   ├── services/
│   │   └── constants/
│   ├── package.json
│   └── App.js
└── README.md
```

## ✨ Features

### Core Features
- 🔐 **JWT Authentication & Authorization** - Secure user authentication with refresh tokens
- 👥 **Student Management System** - Complete user profile management
- 🎫 **Coupon Subscription System** - Automated coupon generation and tracking
- 📧 **Email Notifications** - Automated emails for verification, reminders, and receipts
- 💳 **Payment Gateway Integration** - Razorpay payment processing
- 📊 **Analytics & Reporting** - Usage statistics and reports
- 📱 **QR Code System** - QR code generation and scanning for meal verification
- 🔔 **Push Notifications** - Real-time notifications
- 📈 **Admin Dashboard** - Complete system administration

### Additional Features
- 🔒 **Role-Based Access Control** - Admin, Staff, and Student roles
- ⚡ **Redis Caching** - Fast data retrieval
- 🛡️ **Security** - Rate limiting, input sanitization, XSS protection
- 📝 **Audit Logging** - Track all system activities
- 🔄 **Auto Reminders** - Subscription expiry notifications
- 💾 **Offline Support** - Redux persist for mobile app
- 🎨 **Modern UI** - Clean and intuitive interface

## 🚦 Getting Started

### Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- Redis >= 6.x (optional)
- React Native development environment

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/kamalprajapat21/MessSystem.git
cd MessSystem
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run seed  # Seed database with initial data
npm run dev   # Start development server
```

Backend will run on `http://localhost:5000`

**Default Credentials:**
- Admin: admin@messsystem.com / Admin@123
- Staff: staff@messsystem.com / Staff@123
- Student: student@messsystem.com / Student@123

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
# Update API_BASE_URL in src/constants/index.js
npm start     # Start Metro bundler
npm run ios   # Run on iOS
# OR
npm run android # Run on Android
```

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🏗️ Architecture

### Backend Architecture
- **MVC Pattern** - Models, Controllers, Routes separation
- **Service Layer** - Business logic isolation
- **Middleware** - Authentication, validation, error handling
- **Database** - MongoDB with Mongoose ODM
- **Caching** - Redis for performance optimization

### Frontend Architecture
- **Redux Toolkit** - State management
- **React Navigation** - Screen navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence
- **Component-based** - Reusable UI components

## 🔑 Key Functionalities

### For Students
- Register and login
- Browse subscription plans
- Purchase subscriptions
- View digital coupons with QR codes
- Track coupon usage
- Manage profile

### For Staff
- Scan QR codes to validate coupons
- Manual coupon validation
- View verification history

### For Admin
- Manage subscription plans
- View all users and subscriptions
- Generate reports and analytics
- System configuration
- Audit logs

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get profile
- `POST /api/v1/auth/forgot-password` - Forgot password

### Subscriptions
- `GET /api/v1/subscription-plans` - Get all plans
- `POST /api/v1/subscriptions` - Create subscription
- `GET /api/v1/subscriptions/my-subscriptions` - Get user subscriptions

### Coupons
- `GET /api/v1/coupons/my-coupons` - Get user coupons
- `GET /api/v1/coupons/:id` - Get coupon with QR code
- `POST /api/v1/coupons/scan-qr` - Validate coupon (Staff)

See [Backend README](./backend/README.md) for complete API documentation.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Refresh token mechanism
- Rate limiting
- Input validation and sanitization
- XSS protection
- MongoDB injection prevention
- CORS configuration
- Helmet security headers

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set environment variables
2. Run `npm install --production`
3. Start with `npm start`

### Frontend Deployment
1. Build for production
2. Deploy to Play Store / App Store

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

- Kamal Prajapat ([@kamalprajapat21](https://github.com/kamalprajapat21))

## 📞 Support

For support, email support@messsystem.com or open an issue in the repository.

## 🙏 Acknowledgments

- React Native community
- Node.js ecosystem
- MongoDB documentation
- All contributors

---

**Built with ❤️ for educational institutions**
