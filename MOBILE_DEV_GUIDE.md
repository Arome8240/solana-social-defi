# Mobile App Development Guide

## Quick Start

### Prerequisites

- Node.js v20+
- pnpm v8+
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Expo CLI

### Installation

```bash
# Install all dependencies
pnpm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli
```

## Running the Mobile App

### Development Mode (Expo Go)

```bash
# Start Expo dev server
pnpm dev:mobile

# Or from root
cd apps/mobile-app
pnpm start
```

This will open Expo DevTools. You can:

- Scan QR code with Expo Go app on your phone
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Press `w` to open in web browser

### Native Development (Build & Run)

#### Android

```bash
# From root
pnpm android

# Or from mobile-app directory
cd apps/mobile-app
pnpm android
```

This will:

1. Build the native Android app
2. Install it on connected device/emulator
3. Start the Metro bundler

**Requirements:**

- Android Studio installed
- Android SDK configured
- Android emulator running OR physical device connected

#### iOS (macOS only)

```bash
# From root
pnpm ios

# Or from mobile-app directory
cd apps/mobile-app
pnpm ios
```

**Requirements:**

- Xcode installed
- iOS Simulator OR physical device connected
- CocoaPods installed (`sudo gem install cocoapods`)

### Development with Hot Reload

```bash
# Start dev server for Android
cd apps/mobile-app
pnpm android:dev

# Start dev server for iOS
pnpm ios:dev
```

## Project Structure

```
apps/mobile-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── +not-found.tsx     # 404 page
│   └── _layout.tsx        # Root layout
├── assets/                # Images, fonts, etc.
├── components/            # React components
├── constants/             # App constants
├── hooks/                 # Custom React hooks
├── scripts/               # Build scripts
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Available Scripts

### From Root Directory

```bash
pnpm dev:mobile      # Start Expo dev server
pnpm android         # Build and run on Android
pnpm ios             # Build and run on iOS
pnpm build:mobile    # Export production build
pnpm test:mobile     # Run tests
pnpm lint            # Lint all code
```

### From Mobile App Directory

```bash
cd apps/mobile-app

pnpm start           # Start Expo dev server
pnpm dev             # Same as start
pnpm android         # Build and run on Android
pnpm android:dev     # Start with Android
pnpm ios             # Build and run on iOS
pnpm ios:dev         # Start with iOS
pnpm web             # Run in web browser
pnpm build           # Export production build
pnpm lint            # Lint code
pnpm clean           # Clean build artifacts
```

## Using Shared Package

The mobile app can use the shared package for types, constants, and utilities.

### 1. Add Dependency

Already added in `package.json`:

```json
{
  "dependencies": {
    "@solana-social/shared": "workspace:*"
  }
}
```

### 2. Import and Use

```typescript
import {
  User,
  API_ROUTES,
  formatSolAmount,
  truncateAddress,
} from "@solana-social/shared";

// Use types
const user: User = {
  id: "123",
  username: "john",
  // ...
};

// Use constants
const signupUrl = API_ROUTES.AUTH.SIGNUP;

// Use utilities
const formatted = formatSolAmount(1000000000); // "1.0000"
const short = truncateAddress("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
```

## Connecting to API

### Development

Update the API base URL in your app:

```typescript
// constants/api.ts
const API_BASE_URL = __DEV__
  ? "http://localhost:3000" // Local development
  : "https://api.yourdomain.com"; // Production

export const api = {
  signup: async (data: SignupRequest) => {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.AUTH.SIGNUP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... more API calls
};
```

### Android Emulator

To connect to localhost API from Android emulator:

- Use `http://10.0.2.2:3000` instead of `http://localhost:3000`

### Physical Device

To connect from physical device:

- Use your computer's IP address: `http://192.168.1.x:3000`
- Make sure both devices are on the same network

## Building for Production

### Android APK

```bash
cd apps/mobile-app

# Build APK
eas build --platform android --profile preview

# Or build locally
expo build:android
```

### iOS IPA

```bash
cd apps/mobile-app

# Build IPA
eas build --platform ios --profile preview

# Or build locally (macOS only)
expo build:ios
```

### Using EAS (Expo Application Services)

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login:

```bash
eas login
```

3. Configure:

```bash
eas build:configure
```

4. Build:

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Both
eas build --platform all
```

## Debugging

### React Native Debugger

1. Install React Native Debugger
2. Start the app
3. Press `Cmd+D` (iOS) or `Cmd+M` (Android)
4. Select "Debug"

### Chrome DevTools

1. Start the app
2. Press `Cmd+D` (iOS) or `Cmd+M` (Android)
3. Select "Debug with Chrome"

### Expo DevTools

```bash
pnpm start
```

Opens browser with:

- Device logs
- Performance metrics
- Network requests
- Component inspector

## Common Issues

### Metro Bundler Issues

```bash
# Clear cache
cd apps/mobile-app
pnpm start --clear

# Or
expo start -c
```

### Android Build Issues

```bash
# Clean Android build
cd apps/mobile-app/android
./gradlew clean

# Rebuild
cd ..
pnpm android
```

### iOS Build Issues

```bash
# Clean iOS build
cd apps/mobile-app/ios
rm -rf Pods Podfile.lock
pod install

# Rebuild
cd ..
pnpm ios
```

### Module Not Found

```bash
# Reinstall dependencies
cd apps/mobile-app
rm -rf node_modules
pnpm install

# Rebuild shared package
cd ../../packages/shared
pnpm build
```

## Testing

### Unit Tests

```bash
# Run tests
pnpm test:mobile

# Watch mode
cd apps/mobile-app
pnpm test --watch
```

### E2E Tests (Detox)

Coming soon...

## Environment Variables

Create `.env` file in `apps/mobile-app/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SOLANA_NETWORK=devnet
```

Access in code:

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)

## Tips

1. **Use Expo Go for quick testing**: Fastest way to test on real devices
2. **Use development builds for native modules**: When you need custom native code
3. **Keep Metro bundler running**: Faster reload times
4. **Use TypeScript**: Catch errors early
5. **Test on both platforms**: iOS and Android have differences
6. **Use shared package**: Avoid code duplication with backend

## Next Steps

1. Set up API integration
2. Implement authentication flow
3. Add Solana wallet integration
4. Build social features UI
5. Add push notifications
6. Implement biometric authentication
7. Test on real devices
8. Prepare for production release
