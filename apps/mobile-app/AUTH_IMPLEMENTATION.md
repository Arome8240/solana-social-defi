# Authentication Implementation Guide

## Overview

This mobile app features a complete authentication system using:

- **TanStack Query** for API state management
- **Sonner Native** for toast notifications
- **React Native Reusables** for UI components
- **Zustand** for auth state management
- **AsyncStorage** for token persistence

## Architecture

### Auth Flow

```
App Launch → Initialize Auth → Check Token → Route to Welcome/Home
     ↓
User Login/Signup → API Call → Store Token → Navigate to App
     ↓
User Logout → Clear Token → Navigate to Welcome
```

### Key Components

#### 1. Auth Hook (`hooks/use-auth.ts`)

Zustand store managing authentication state:

- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean auth status
- `isLoading`: Loading state during initialization
- `setAuth()`: Store user and token
- `logout()`: Clear auth and redirect
- `initialize()`: Load persisted auth on app start

#### 2. API Client (`lib/api.ts`)

Axios instance with:

- Automatic token injection via interceptor
- Base URL configuration (dev/prod)
- Error handling for 401 responses
- Auth endpoints (signup, login, wallet, etc.)

#### 3. Root Layout (`app/_layout.tsx`)

- Initializes auth on mount
- Protected route navigation
- Redirects based on auth state
- Provides QueryClient and Toaster

#### 4. Auth Screens

**Welcome Screen** (`app/(auth)/welcome.tsx`)

- Landing page with app features
- Navigation to login/signup

**Login Screen** (`app/(auth)/login.tsx`)

- Email/password form
- TanStack Query mutation for login
- Form validation
- Error handling with Sonner toasts
- Auto-navigation on success

**Signup Screen** (`app/(auth)/signup.tsx`)

- Username, email, password fields
- Password confirmation
- Client-side validation
- Wallet creation info
- Success toast with user details

#### 5. App Screens

**Home Screen** (`app/(app)/home/index.tsx`)

- Welcome message with username
- Wallet balance display
- Quick stats cards
- Pull-to-refresh functionality
- TanStack Query for wallet data

**Profile Screen** (`app/(app)/profile/index.tsx`)

- User information display
- Wallet address
- Settings menu items
- Logout functionality with confirmation

## Usage

### Login Flow

```typescript
const loginMutation = useMutation({
  mutationFn: authAPI.login,
  onSuccess: async (data) => {
    await setAuth(data.user, data.token);
    toast.success("Welcome back!");
    router.replace("/(app)/home");
  },
  onError: (error) => {
    toast.error("Login Failed", {
      description: error.response?.data?.error,
    });
  },
});
```

### Logout Flow

```typescript
const handleLogout = async () => {
  await logout(); // Clears AsyncStorage and state
  toast.success("Logged out successfully");
  // Auto-redirects to /(auth)/welcome
};
```

### Protected Routes

The root layout automatically handles navigation:

- Unauthenticated users → Welcome screen
- Authenticated users in auth routes → Home screen
- Authenticated users → Stay in app

### API Calls with Auth

```typescript
// Token automatically added via interceptor
const { data } = useQuery({
  queryKey: ["wallet"],
  queryFn: authAPI.getWallet,
  enabled: !!user,
});
```

## Features

### ✅ Implemented

- User registration with validation
- Email/password login
- Persistent authentication (AsyncStorage)
- Automatic token injection
- Protected route navigation
- Logout with confirmation
- Toast notifications for all actions
- Loading states during API calls
- Error handling with user feedback
- Pull-to-refresh on home screen
- Wallet information display
- Profile management

### 🔄 Validation

**Client-side:**

- Email format
- Password length (min 8 chars)
- Username length (min 3 chars)
- Password confirmation match
- Required field checks

**Server-side:**

- API validates all inputs
- Returns descriptive error messages
- Handled by mutation error callbacks

### 🎨 UI/UX

- Smooth animations and transitions
- Loading indicators during operations
- Disabled inputs during API calls
- Rich toast notifications with descriptions
- Keyboard-aware forms
- Safe area handling
- Pull-to-refresh support

## API Endpoints

```typescript
// Signup
POST /api/auth/signup
Body: { username, email, password }
Response: { user, token }

// Login
POST /api/auth/login
Body: { email, password }
Response: { user, token }

// Get Wallet
GET /api/auth/wallet
Headers: { Authorization: Bearer <token> }
Response: { balance, walletAddress, ... }
```

## Environment Configuration

Update `lib/api.ts` for your API:

```typescript
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3000"; // Android emulator
    }
    return "http://localhost:3000"; // iOS simulator
  }
  return "https://api.yourdomain.com"; // Production
};
```

## Testing

### Test Login

1. Start the app
2. Navigate to Login from Welcome
3. Enter credentials
4. Verify success toast
5. Check navigation to Home
6. Verify user data displayed

### Test Signup

1. Navigate to Signup from Welcome
2. Fill all fields
3. Verify validation messages
4. Submit form
5. Check wallet creation message
6. Verify auto-login and navigation

### Test Logout

1. Navigate to Profile
2. Tap Logout button
3. Confirm in alert dialog
4. Verify success toast
5. Check navigation to Welcome

### Test Persistence

1. Login successfully
2. Close app completely
3. Reopen app
4. Verify auto-login to Home

## Troubleshooting

### Token not persisting

- Check AsyncStorage permissions
- Verify `setAuth()` is called after login
- Check `initialize()` is called on mount

### Navigation issues

- Verify route names match exactly
- Check auth state in root layout
- Ensure segments are correct

### API errors

- Check base URL configuration
- Verify backend is running
- Check network connectivity
- Review axios interceptors

### Toast not showing

- Verify Toaster is in root layout
- Check toast import from sonner-native
- Ensure GestureHandlerRootView wraps app

## Next Steps

Consider adding:

- Biometric authentication
- Password reset flow
- Email verification
- Social login (Google, Apple)
- Refresh token rotation
- Session timeout handling
- Multi-factor authentication
