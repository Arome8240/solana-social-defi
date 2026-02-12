# Quick Start - Authentication

## 🚀 Get Started in 3 Steps

### 1. Start the API

```bash
# From root directory
pnpm dev:api
```

The API will run on `http://localhost:3000`

### 2. Start the Mobile App

```bash
# From root directory
pnpm android

# Or use Expo Go
pnpm dev:mobile
```

### 3. Test Authentication

1. App opens to welcome screen
2. Tap "Create account"
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm password: `password123`
4. Tap "Create account"
5. ✅ Account created with auto-generated Solana wallet!
6. You're now logged in and redirected to home

## 📱 Screens Available

- `/welcome` - Onboarding screen
- `/login` - Sign in
- `/signup` - Create account
- `/home` - Main app (protected)

## 🔐 Test Accounts

Create your own accounts or use these for testing:

```
Email: demo@example.com
Password: demo12345
```

## 🎯 What You Can Do

### After Signup

- ✅ Auto-generated Solana wallet
- ✅ Secure authentication
- ✅ Persistent login (stays logged in)
- ✅ Access to all app features

### User Info Available

```typescript
const { user } = useAuth();

console.log(user.username); // "testuser"
console.log(user.email); // "test@example.com"
console.log(user.walletAddress); // "7xKXtg2CW87d..."
console.log(user.role); // "user"
```

## 🔄 Testing Logout

```typescript
import { useAuth } from '@/hooks/use-auth';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onPress={logout}>
      <Text>Logout</Text>
    </Button>
  );
}
```

## 🐛 Common Issues

### Can't connect to API

**Android Emulator:**

- API URL is automatically set to `http://10.0.2.2:3000`
- Make sure API is running on port 3000

**iOS Simulator:**

- Uses `http://localhost:3000`
- Should work automatically

**Physical Device:**

- Edit `apps/mobile-app/lib/api.ts`
- Change to your computer's IP: `http://192.168.1.x:3000`
- Make sure both devices are on same network

### App crashes on startup

```bash
# Clear cache and restart
cd apps/mobile-app
rm -rf .expo node_modules
pnpm install
pnpm start --clear
```

### Login not working

1. Check API is running: `curl http://localhost:3000/health`
2. Check network tab in React Native Debugger
3. Verify credentials are correct
4. Check API logs for errors

## 📚 Learn More

- [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) - Complete auth guide
- [MOBILE_DEV_GUIDE.md](../../MOBILE_DEV_GUIDE.md) - Mobile development
- [API_EXAMPLES.md](../../docs/API_EXAMPLES.md) - API documentation

## 🎉 Next Steps

Now that auth is working:

1. **Explore the app** - Navigate through screens
2. **View wallet** - Check your auto-generated wallet
3. **Create posts** - Start using social features
4. **Earn rewards** - Get SKR tokens for engagement
5. **Trade tokens** - Use DeFi features

Happy coding! 🚀
