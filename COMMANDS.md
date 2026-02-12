# Quick Command Reference

## Installation

```bash
pnpm install              # Install all dependencies
```

## Development

```bash
pnpm dev                  # Run all apps in parallel
pnpm dev:api              # Run API only
pnpm dev:mobile           # Run mobile app (Expo dev server)
pnpm android              # Build and run on Android
pnpm ios                  # Build and run on iOS
```

## Building

```bash
pnpm build                # Build all apps
pnpm build:api            # Build API only
pnpm build:mobile         # Build mobile app
```

## Testing

```bash
pnpm test                 # Run all tests
pnpm test:api             # Run API tests
pnpm test:mobile          # Run mobile tests
```

## Linting

```bash
pnpm lint                 # Lint all code
```

## Cleaning

```bash
pnpm clean                # Clean all node_modules and build artifacts
```

## Package Management

```bash
# Add dependency to API
pnpm --filter @solana-social/api add <package>

# Add dependency to mobile app
pnpm --filter @solana-social/mobile-app add <package>

# Add dependency to shared package
pnpm --filter @solana-social/shared add <package>

# Add dev dependency
pnpm --filter @solana-social/api add -D <package>

# Remove dependency
pnpm --filter @solana-social/api remove <package>
```

## Mobile Specific

```bash
cd apps/mobile-app

pnpm start                # Start Expo dev server
pnpm android              # Build and run on Android
pnpm android:dev          # Start with Android
pnpm ios                  # Build and run on iOS
pnpm ios:dev              # Start with iOS
pnpm web                  # Run in web browser
pnpm clean                # Clean mobile build artifacts
```

## API Specific

```bash
cd apps/api

pnpm dev                  # Start API in development mode
pnpm build                # Build API
pnpm start                # Start API in production mode
pnpm test                 # Run API tests
pnpm lint                 # Lint API code
```

## Shared Package

```bash
cd packages/shared

pnpm build                # Build shared package
pnpm dev                  # Build in watch mode
pnpm clean                # Clean build artifacts
```

## Docker (API)

```bash
cd apps/api

docker-compose up         # Start API with MongoDB
docker-compose up -d      # Start in detached mode
docker-compose down       # Stop services
docker-compose logs -f    # View logs
```

## Useful Combinations

```bash
# Fresh install
pnpm clean && pnpm install

# Rebuild everything
pnpm clean && pnpm install && pnpm build

# Run API and mobile in parallel
pnpm dev

# Test everything
pnpm test

# Lint everything
pnpm lint
```

## Environment Setup

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/mobile-app/.env.example apps/mobile-app/.env

# Edit environment files
nano apps/api/.env
nano apps/mobile-app/.env
```

## Git

```bash
git status                # Check status
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push                  # Push to remote
```

## Troubleshooting

```bash
# Clear all caches
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild shared package
cd packages/shared && pnpm build

# Clear Metro bundler cache (mobile)
cd apps/mobile-app && pnpm start --clear

# Clear Android build
cd apps/mobile-app/android && ./gradlew clean

# Reinstall iOS pods
cd apps/mobile-app/ios && rm -rf Pods && pod install
```
