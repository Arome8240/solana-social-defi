# ✅ Android Development Setup Complete

## What Was Updated

### 1. Root package.json

Added new scripts for mobile development:

```json
{
  "scripts": {
    "android": "pnpm --filter @solana-social/mobile-app android",
    "ios": "pnpm --filter @solana-social/mobile-app ios"
  }
}
```

### 2. Mobile App package.json

- Updated package name to `@solana-social/mobile-app`
- Added `dev` script (alias for `start`)
- Added `android:dev` script (start with Android)
- Added `ios:dev` script (start with iOS)
- Added `build` script (export production build)
- Added `test` script (placeholder)
- Added `clean` script (remove build artifacts)

### 3. Documentation

Created comprehensive guides:

- **MOBILE_DEV_GUIDE.md** - Complete mobile development guide
- **COMMANDS.md** - Quick command reference
- Updated **README.md** - Added Android/iOS commands
- Updated **MONOREPO_GUIDE.md** - Added mobile commands

## 🚀 Quick Start

### Run Mobile App on Android

```bash
# From root directory
pnpm android

# Or from mobile-app directory
cd apps/mobile-app
pnpm android
```

### Run Mobile App on iOS

```bash
# From root directory
pnpm ios

# Or from mobile-app directory
cd apps/mobile-app
pnpm ios
```

### Development Mode (Expo Go)

```bash
# Start Expo dev server
pnpm dev:mobile

# Then:
# - Scan QR code with Expo Go app
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Press 'w' for web browser
```

## 📱 Available Commands

### From Root

```bash
pnpm dev:mobile    # Start Expo dev server
pnpm android       # Build and run on Android
pnpm ios           # Build and run on iOS
pnpm build:mobile  # Export production build
```

### From Mobile App Directory

```bash
cd apps/mobile-app

pnpm start         # Start Expo dev server
pnpm dev           # Same as start
pnpm android       # Build and run on Android
pnpm android:dev   # Start with Android
pnpm ios           # Build and run on iOS
pnpm ios:dev       # Start with iOS
pnpm web           # Run in web browser
pnpm build         # Export production build
pnpm clean         # Clean build artifacts
```

## 📋 Prerequisites

### For Android Development

1. **Android Studio** installed
2. **Android SDK** configured
3. **Android Emulator** running OR physical device connected via USB

### For iOS Development (macOS only)

1. **Xcode** installed
2. **iOS Simulator** OR physical device connected
3. **CocoaPods** installed: `sudo gem install cocoapods`

### For Expo Go (Easiest)

1. Install **Expo Go** app on your phone:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
2. Run `pnpm dev:mobile`
3. Scan QR code with Expo Go

## 🔧 Android Emulator Setup

### 1. Install Android Studio

Download from: https://developer.android.com/studio

### 2. Install Android SDK

1. Open Android Studio
2. Go to Settings → Appearance & Behavior → System Settings → Android SDK
3. Install latest SDK (API 34 or higher)

### 3. Create Virtual Device

1. Open Android Studio
2. Tools → Device Manager
3. Create Device → Select device (e.g., Pixel 6)
4. Download system image
5. Finish setup

### 4. Start Emulator

```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd <device-name>

# Or start from Android Studio
# Tools → Device Manager → Play button
```

### 5. Run App

```bash
pnpm android
```

## 🍎 iOS Simulator Setup (macOS only)

### 1. Install Xcode

Download from Mac App Store

### 2. Install Command Line Tools

```bash
xcode-select --install
```

### 3. Install CocoaPods

```bash
sudo gem install cocoapods
```

### 4. Run App

```bash
pnpm ios
```

## 🔗 Connecting to API

### From Android Emulator

Use `http://10.0.2.2:3000` instead of `localhost:3000`

```typescript
const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
```

### From Physical Device

1. Find your computer's IP address:

   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Use IP address in app:

   ```typescript
   const API_URL = "http://192.168.1.x:3000";
   ```

3. Make sure both devices are on same network

### From Expo Go

Expo automatically handles localhost connections!

## 📚 Documentation

- **MOBILE_DEV_GUIDE.md** - Complete mobile development guide
- **COMMANDS.md** - Quick command reference
- **README.md** - Main project documentation
- **MONOREPO_GUIDE.md** - Workspace management

## 🎯 Next Steps

1. ✅ Run `pnpm install` to install dependencies
2. ✅ Start API: `pnpm dev:api`
3. ✅ Start mobile app: `pnpm android` or `pnpm dev:mobile`
4. 📱 Build authentication UI
5. 🔗 Connect to API endpoints
6. 🎨 Implement social features
7. 💰 Add Solana wallet integration
8. 🧪 Add tests
9. 🚀 Deploy to app stores

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
cd apps/mobile-app
pnpm start --clear
```

### Android Build Issues

```bash
cd apps/mobile-app/android
./gradlew clean
cd ..
pnpm android
```

### Module Not Found

```bash
# Rebuild shared package
cd packages/shared
pnpm build

# Reinstall mobile dependencies
cd ../apps/mobile-app
rm -rf node_modules
pnpm install
```

### Emulator Not Starting

```bash
# Kill existing emulator processes
adb kill-server
adb start-server

# Restart emulator
emulator -avd <device-name>
```

## ✨ You're Ready!

Your monorepo is now fully configured for mobile development with Android support!

Run `pnpm android` to start building your Solana social DeFi mobile app! 🚀

---

For more details, see **MOBILE_DEV_GUIDE.md**
