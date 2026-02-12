# Authentication Quick Reference

## 🚀 Quick Start

```bash
# Start the development server
cd apps/mobile-app
pnpm start

# Run on Android
pnpm android:dev

# Run on iOS
pnpm ios:dev
```

## 📱 Test Credentials

Use your API's test accounts or create new ones through the signup flow.

## 🔑 Key Files

| File                | Purpose                           |
| ------------------- | --------------------------------- |
| `hooks/use-auth.ts` | Auth state management (Zustand)   |
| `lib/api.ts`        | API client with auth interceptors |
| `lib/auth-utils.ts` | Validation and utility functions  |
| `app/_layout.tsx`   | Root layout with auth navigation  |
| `app/(auth)/*`      | Authentication screens            |
| `app/(app)/*`       | Protected app screens             |

## 🎯 Common Tasks

### Access Current User

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Login />;

  return <Text>Hello {user.username}</Text>;
}
```

### Make Authenticated API Call

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

function MyComponent() {
  const { data } = useQuery({
    queryKey: ["myData"],
    queryFn: async () => {
      const response = await api.get("/api/my-endpoint");
      return response.data;
    },
  });
}
```

### Show Toast Notification

```typescript
import { toast } from "sonner-native";

// Success
toast.success("Success!", {
  description: "Operation completed",
});

// Error
toast.error("Error!", {
  description: "Something went wrong",
});

// Info
toast.info("Info", {
  description: "Just so you know...",
});
```

### Logout User

```typescript
import { useAuth } from "@/hooks/use-auth";

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onPress={logout}>
      Logout
    </Button>
  );
}
```

### Navigate Between Screens

```typescript
import { router } from "expo-router";

// Navigate to screen
router.push("/(app)/profile");

// Replace current screen
router.replace("/(auth)/login");

// Go back
router.back();
```

## 🎨 UI Components

### Button

```typescript
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

<Button onPress={handlePress}>
  <Text>Click Me</Text>
</Button>

<Button variant="outline" onPress={handlePress}>
  <Text>Outline Button</Text>
</Button>
```

### Input

```typescript
import { Input } from "@/components/ui/input";

<Input
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### Text

```typescript
import { Text } from "@/components/ui/text";

<Text className="text-lg font-bold text-gray-900">
  Hello World
</Text>
```

## 🔐 Auth State

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  walletAddress: string;
  biometricEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}
```

## 🌐 API Endpoints

```typescript
// Signup
authAPI.signup({ username, email, password });

// Login
authAPI.login({ email, password });

// Get Wallet
authAPI.getWallet();

// Toggle Biometric
authAPI.toggleBiometric(enabled);

// Export Private Key
authAPI.exportPrivateKey(password);
```

## 🎭 TanStack Query Patterns

### Basic Query

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["key"],
  queryFn: fetchFunction,
});
```

### Mutation

```typescript
const mutation = useMutation({
  mutationFn: apiFunction,
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});

mutation.mutate(payload);
```

### With Loading State

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
});

if (isLoading) return <ActivityIndicator />;
return <DataDisplay data={data} />;
```

## 🎨 Styling with NativeWind

```typescript
// Tailwind classes
<View className="flex-1 bg-white px-6 pt-8">
  <Text className="text-2xl font-bold text-gray-900">
    Title
  </Text>
</View>

// Conditional classes
<View className={cn(
  "p-4 rounded-lg",
  isActive ? "bg-blue-500" : "bg-gray-200"
)}>
```

## 🐛 Debugging

### Check Auth State

```typescript
const { user, token, isAuthenticated } = useAuth();
console.log({ user, token, isAuthenticated });
```

### Check AsyncStorage

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const token = await AsyncStorage.getItem("auth_token");
const user = await AsyncStorage.getItem("user");
console.log({ token, user });
```

### Network Requests

```typescript
// In lib/api.ts, add logging
api.interceptors.request.use((config) => {
  console.log("Request:", config.method, config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.log("Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  },
);
```

## 📦 Dependencies

```json
{
  "@tanstack/react-query": "^5.90.21",
  "sonner-native": "^0.23.1",
  "zustand": "^5.0.11",
  "axios": "^1.13.5",
  "@react-native-async-storage/async-storage": "2.2.0",
  "expo-router": "~6.0.23"
}
```

## 🔄 State Flow

```
User Action → Mutation → API Call → Success/Error
                                    ↓
                              Update Zustand Store
                                    ↓
                              Show Toast
                                    ↓
                              Navigate
```

## ✅ Checklist

- [ ] API base URL configured
- [ ] Backend server running
- [ ] Dependencies installed
- [ ] Auth screens working
- [ ] Login flow tested
- [ ] Signup flow tested
- [ ] Logout working
- [ ] Token persistence working
- [ ] Protected routes working
- [ ] Toast notifications showing
- [ ] Error handling working
