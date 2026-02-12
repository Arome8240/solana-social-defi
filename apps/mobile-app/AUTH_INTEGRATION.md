# Authentication Integration Guide

## ✅ What's Been Implemented

### 1. **Complete Auth Flow**

- ✅ Welcome/Onboarding screen
- ✅ Login screen
- ✅ Signup screen
- ✅ Protected routes
- ✅ Auto-redirect based on auth state

### 2. **State Management**

- ✅ Zustand store for auth state (`hooks/use-auth.ts`)
- ✅ AsyncStorage for token persistence
- ✅ Auto-initialization on app start

### 3. **API Integration**

- ✅ Axios instance with interceptors (`lib/api.ts`)
- ✅ Auto token injection
- ✅ Auto logout on 401
- ✅ Platform-specific base URLs

### 4. **TanStack Query**

- ✅ QueryClient configured
- ✅ Mutations for login/signup
- ✅ Error handling
- ✅ Loading states

### 5. **UI/UX**

- ✅ Base-inspired clean design
- ✅ Sonner Native toasts for feedback
- ✅ Form validation
- ✅ Loading states
- ✅ Keyboard handling

## 📁 File Structure

```
apps/mobile-app/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx       # Auth layout
│   │   ├── welcome.tsx       # Onboarding screen
│   │   ├── login.tsx         # Login screen
│   │   └── signup.tsx        # Signup screen
│   ├── (app)/                # Protected app routes
│   ├── _layout.tsx           # Root layout with auth logic
│   └── index.tsx             # Initial redirect
├── hooks/
│   └── use-auth.ts           # Auth state management
├── lib/
│   └── api.ts                # API client & endpoints
└── components/ui/            # Reusable UI components
```

## 🚀 How It Works

### Authentication Flow

1. **App Launch**
   - `_layout.tsx` initializes auth state
   - Checks AsyncStorage for saved token
   - Redirects to login or home based on auth state

2. **Login/Signup**
   - User fills form
   - TanStack Query mutation sends request
   - On success: Save token & user to AsyncStorage
   - Update Zustand store
   - Navigate to home

3. **Protected Routes**
   - `_layout.tsx` watches auth state
   - Redirects unauthenticated users to login
   - Redirects authenticated users to app

4. **Logout**
   - Clear AsyncStorage
   - Clear Zustand store
   - Navigate to login

### API Configuration

The API client automatically handles:

- **Base URL**: Adjusts for Android emulator (`10.0.2.2`)
- **Token Injection**: Adds `Authorization` header
- **Auto Logout**: Clears auth on 401 responses

## 🔧 Configuration

### API Base URL

Edit `apps/mobile-app/lib/api.ts`:

```typescript
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3000"; // Android emulator
    }
    return "http://localhost:3000"; // iOS/web
  }
  return "https://api.yourdomain.com"; // Production
};
```

### Environment Variables

Create `.env` in `apps/mobile-app/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Then use in code:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
```

## 📱 Screens

### Welcome Screen (`/welcome`)

- Onboarding/landing page
- Features overview
- Sign up / Sign in buttons

### Login Screen (`/login`)

- Email input
- Password input
- Sign in button
- Link to signup

### Signup Screen (`/signup`)

- Username input
- Email input
- Password input
- Confirm password input
- Create account button
- Info about auto-generated wallet
- Link to login

## 🎨 UI Components Used

All screens use your existing UI components:

- `<Text>` - Typography
- `<Input>` - Form inputs
- `<Button>` - Actions
- `<View>` - Layout

Styling with:

- NativeWind (Tailwind CSS)
- Base-inspired color palette
- Clean, minimal design

## 🔔 Toast Notifications

Using Sonner Native for user feedback:

```typescript
import { toast } from "sonner-native";

// Success
toast.success("Welcome back!", {
  description: "Logged in successfully",
});

// Error
toast.error("Login Failed", {
  description: "Invalid credentials",
});
```

## 🔐 Auth Hook Usage

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Text>Please login</Text>;
  }

  return (
    <View>
      <Text>Welcome {user?.username}!</Text>
      <Text>Wallet: {user?.walletAddress}</Text>
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
```

## 🔄 API Mutations

### Login

```typescript
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

const loginMutation = useMutation({
  mutationFn: authAPI.login,
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});

// Use it
loginMutation.mutate({ email, password });
```

### Signup

```typescript
const signupMutation = useMutation({
  mutationFn: authAPI.signup,
  onSuccess: (data) => {
    // Handle success
  },
});

signupMutation.mutate({ username, email, password });
```

## 🧪 Testing

### Test Login Flow

1. Start API: `pnpm dev:api`
2. Start mobile: `pnpm android` or `pnpm dev:mobile`
3. Navigate to login screen
4. Enter credentials
5. Verify redirect to home
6. Check AsyncStorage for token

### Test Signup Flow

1. Navigate to signup screen
2. Fill all fields
3. Submit form
4. Verify wallet creation message
5. Verify redirect to home

### Test Protected Routes

1. Logout
2. Try to access `/home`
3. Verify redirect to login
4. Login
5. Verify redirect to home

## 🐛 Troubleshooting

### API Connection Issues

**Android Emulator:**

```typescript
// Use 10.0.2.2 instead of localhost
const API_URL = "http://10.0.2.2:3000";
```

**Physical Device:**

```typescript
// Use your computer's IP
const API_URL = "http://192.168.1.x:3000";
```

### Token Not Persisting

Check AsyncStorage:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Debug
const token = await AsyncStorage.getItem("auth_token");
console.log("Token:", token);
```

### Navigation Issues

Clear navigation state:

```bash
cd apps/mobile-app
rm -rf .expo
pnpm start --clear
```

## 📝 Next Steps

### 1. Add More Auth Features

- [ ] Forgot password
- [ ] Email verification
- [ ] Biometric authentication
- [ ] Social login (Google, Apple)

### 2. Enhance Security

- [ ] Refresh tokens
- [ ] Token expiration handling
- [ ] Secure storage for sensitive data
- [ ] Rate limiting on client

### 3. Improve UX

- [ ] Remember me checkbox
- [ ] Auto-fill credentials
- [ ] Password strength indicator
- [ ] Loading skeletons

### 4. Add Profile Features

- [ ] View wallet info
- [ ] Export private key
- [ ] Update profile
- [ ] Change password

## 🔗 API Endpoints Used

All endpoints from `@solana-social/shared`:

```typescript
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/wallet
PATCH /api/auth/biometric
POST /api/auth/export-private-key
```

## 💡 Tips

1. **Always handle loading states** - Show spinners during API calls
2. **Validate inputs** - Check before sending to API
3. **Show helpful errors** - Use toast notifications
4. **Test on real devices** - Emulators behave differently
5. **Use TypeScript** - Catch errors early

## 🎉 You're Ready!

Your authentication system is fully integrated and ready to use!

**Test it now:**

```bash
# Terminal 1: Start API
pnpm dev:api

# Terminal 2: Start mobile app
pnpm android
```

Then create an account and start building! 🚀
