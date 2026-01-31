# Mess Management System - Mobile App (React Native)

Complete React Native mobile application for students to manage mess subscriptions, view coupons, and scan QR codes.

## 🚀 Features

- ✅ User Authentication (Login, Register, Forgot Password)
- ✅ Student Dashboard with Subscription Overview
- ✅ Subscription Plan Management
- ✅ Digital Coupon System with QR Codes
- ✅ Real-time Coupon Status Tracking
- ✅ Profile Management
- ✅ Push Notifications
- ✅ Offline Support with Redux Persist
- ✅ Role-Based Interfaces (Student, Staff, Admin)

## 📋 Prerequisites

- Node.js >= 14.x
- React Native development environment
- iOS: Xcode (for Mac users)
- Android: Android Studio with Android SDK
- CocoaPods (for iOS)

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Make sure you have Android Studio installed and configured with the Android SDK.

### 4. Environment Configuration

Update the API base URL in `src/constants/index.js`:

```javascript
export const API_BASE_URL = 'http://YOUR_BACKEND_IP:5000/api/v1';
```

For development:
- iOS Simulator: `http://localhost:5000/api/v1`
- Android Emulator: `http://10.0.2.2:5000/api/v1`
- Physical Device: `http://YOUR_COMPUTER_IP:5000/api/v1`

## 🏃‍♂️ Running the Application

### Start Metro Bundler

```bash
npm start
```

### Run on iOS

```bash
npm run ios
```

Or for specific simulator:
```bash
npm run ios -- --simulator="iPhone 14 Pro"
```

### Run on Android

```bash
npm run android
```

## 📱 App Screens

### Authentication
- **Login Screen** - Email/password authentication
- **Register Screen** - New student registration
- **Forgot Password** - Password recovery

### Student Interface
- **Dashboard** - Overview of subscriptions and coupons
- **My Subscriptions** - View all subscriptions
- **Subscription Plans** - Browse and purchase plans
- **My Coupons** - View available coupons
- **Coupon QR Code** - Display QR code for meal verification
- **Profile** - View and edit profile

### Staff Interface
- **QR Scanner** - Scan student coupons
- **Manual Validation** - Enter coupon code manually
- **Recent Scans** - View scan history

### Admin Interface
- **Dashboard** - System overview and statistics
- **User Management** - Manage students and staff
- **Subscription Management** - View all subscriptions
- **Reports** - Generate usage reports

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js
│   ├── screens/             # Screen components
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── Student/
│   │   │   ├── DashboardScreen.js
│   │   │   ├── SubscriptionsScreen.js
│   │   │   ├── CouponsScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── Staff/
│   │   │   ├── ScannerScreen.js
│   │   │   └── ValidateScreen.js
│   │   └── Admin/
│   │       ├── DashboardScreen.js
│   │       └── ReportsScreen.js
│   ├── components/          # Reusable components
│   │   ├── common/
│   │   ├── student/
│   │   ├── staff/
│   │   └── admin/
│   ├── redux/               # State management
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── subscriptionSlice.js
│   │   │   └── couponSlice.js
│   │   └── store/
│   │       └── index.js
│   ├── services/            # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── subscriptionService.js
│   │   └── couponService.js
│   ├── constants/           # Constants and theme
│   │   ├── index.js
│   │   └── theme.js
│   ├── utils/               # Utility functions
│   └── assets/              # Images, icons, fonts
├── android/                 # Android native code
├── ios/                     # iOS native code
├── App.js                   # Root component
├── index.js                 # Entry point
├── package.json
├── babel.config.js
├── metro.config.js
└── README.md
```

## 🎨 Theme & Styling

The app uses a centralized theme system defined in `src/constants/theme.js`:

```javascript
import { Colors, Spacing, FontSizes, BorderRadius } from './constants/theme';
```

### Color Palette
- **Primary**: #4CAF50 (Green)
- **Secondary**: #2196F3 (Blue)
- **Success**: #4CAF50
- **Warning**: #FF9800
- **Error**: #F44336

## 🔄 State Management

Redux Toolkit is used for state management with the following slices:

- **authSlice** - User authentication and profile
- **subscriptionSlice** - Subscription plans and user subscriptions
- **couponSlice** - Coupon management and QR codes

### Usage Example

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/slices/authSlice';

const dispatch = useDispatch();
const { user, loading } = useSelector(state => state.auth);

// Login
dispatch(login({ email, password }));
```

## 📡 API Integration

All API calls are handled through service files:

```javascript
import authService from './services/authService';
import subscriptionService from './services/subscriptionService';
import couponService from './services/couponService';

// Example: Get user profile
const profile = await authService.getProfile();

// Example: Fetch coupons
const coupons = await couponService.getMyCoupons();
```

## 🔐 Authentication Flow

1. User enters credentials on Login screen
2. Redux action dispatches login request
3. API service sends request to backend
4. On success, token is stored in AsyncStorage
5. User is redirected to appropriate dashboard
6. Token is automatically attached to all API requests

## 📱 QR Code System

### Student Flow
1. Student views available coupon
2. Generates QR code for coupon
3. Shows QR code to mess staff

### Staff Flow
1. Staff opens QR scanner
2. Scans student's QR code
3. Validates coupon in real-time
4. Marks coupon as used

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Clear All Caches
```bash
watchman watch-del-all
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

## 📦 Dependencies

### Core
- `react` - UI framework
- `react-native` - Mobile framework
- `@react-navigation/native` - Navigation
- `@reduxjs/toolkit` - State management
- `axios` - HTTP client

### UI Components
- `react-native-elements` - UI components
- `react-native-vector-icons` - Icons
- `react-native-paper` - Material Design components
- `react-native-toast-message` - Toast notifications

### Features
- `react-native-qrcode-svg` - QR code generation
- `react-native-camera` - Camera for scanning
- `@react-native-async-storage/async-storage` - Local storage
- `redux-persist` - Persist Redux state

## 🌟 Best Practices

- Use functional components with hooks
- Implement proper error handling
- Follow component composition pattern
- Use TypeScript for type safety (optional)
- Keep components small and focused
- Use Redux for global state, local state for UI state
- Implement proper loading and error states
- Add meaningful comments
- Follow React Native performance best practices

## 🔒 Security

- Tokens stored securely in AsyncStorage
- Automatic token refresh
- Input validation on all forms
- Secure API communication
- No sensitive data in AsyncStorage without encryption

## 📲 Push Notifications

The app supports push notifications for:
- Subscription expiry reminders
- Payment confirmations
- Coupon usage alerts
- System announcements

## 🌐 Offline Support

- Redux Persist maintains app state offline
- Queued actions sync when online
- Cached data displayed when offline

## 🎯 Future Enhancements

- [ ] Dark mode support
- [ ] Biometric authentication
- [ ] In-app chat support
- [ ] Multiple language support
- [ ] Payment gateway integration
- [ ] Analytics dashboard
- [ ] Meal menu display
- [ ] Feedback system

## 📞 Support

For issues or questions, please open an issue in the repository.

## 📄 License

MIT
