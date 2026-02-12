# 🚀 Quick Start Guide

Get up and running with Solana Social in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running
- pnpm installed (`npm install -g pnpm`)

## Step 1: Install Dependencies

```bash
# From project root
pnpm install
```

## Step 2: Setup Environment

Create `apps/api/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/solana-social
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-secret-key-here
SOLANA_RPC_URL=https://api.devnet.solana.com
PORT=3000
```

## Step 3: Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 4: Create Test Account

```bash
cd apps/api
pnpm run seed:quick
```

**Test Credentials:**

- Email: `test@example.com`
- Password: `password123`

## Step 5: Start API Server

```bash
# In apps/api directory
pnpm run dev
```

API will be available at `http://localhost:3000`

## Step 6: Start Mobile App

```bash
# In apps/mobile-app directory (new terminal)
cd apps/mobile-app
pnpm run start
```

Then:

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

## Step 7: Login to App

1. Open the app
2. Tap "Sign in" on welcome screen
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
4. Tap "Sign in"

## 🎉 You're Ready!

Explore the features:

- ✅ Wallet with SOL and SKR tokens
- ✅ Send and receive crypto
- ✅ Swap tokens
- ✅ Stake for rewards
- ✅ Search users and tokens
- ✅ View market prices
- ✅ Transaction history

## Need More Test Data?

Run the full seed script:

```bash
cd apps/api
pnpm run seed
```

This creates:

- 5 test users
- 6 tokens (SOL, USDC, USDT, SKR, RAY, BONK)
- 8 social posts
- 4 trade transactions

## Troubleshooting

**MongoDB not connecting?**

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
```

**Port 3000 already in use?**

```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Mobile app can't connect?**

- Check API is running: `curl http://localhost:3000/health`
- For Android emulator, API URL should be `http://10.0.2.2:3000`
- For physical device, use your computer's IP address

## Full Documentation

See [SETUP_AND_SEED_GUIDE.md](./SETUP_AND_SEED_GUIDE.md) for detailed instructions.

## Project Structure

```
solana-social/
├── apps/
│   ├── api/              # Backend API
│   │   ├── src/
│   │   │   ├── scripts/  # Seed scripts
│   │   │   ├── models/   # Database models
│   │   │   └── ...
│   │   └── package.json
│   └── mobile-app/       # React Native app
│       ├── app/          # Screens
│       ├── components/   # UI components
│       └── package.json
└── packages/
    └── shared/           # Shared code
```

## Available Scripts

### API (apps/api)

- `pnpm run dev` - Start development server
- `pnpm run seed:quick` - Create test account
- `pnpm run seed` - Create full demo data
- `pnpm run build` - Build for production
- `pnpm run test` - Run tests

### Mobile App (apps/mobile-app)

- `pnpm run start` - Start Expo dev server
- `pnpm run android` - Run on Android
- `pnpm run ios` - Run on iOS
- `pnpm run web` - Run on web

## Test Accounts (Full Seed)

| Email               | Password    | Role    | SKR  | SOL |
| ------------------- | ----------- | ------- | ---- | --- |
| dev@arome.com       | password123 | Admin   | 1000 | 10  |
| alice@example.com   | password123 | Creator | 500  | 5   |
| bob@example.com     | password123 | User    | 250  | 2.5 |
| charlie@example.com | password123 | User    | 750  | 7.5 |
| diana@example.com   | password123 | Creator | 600  | 6   |

## Features Implemented

### Authentication

- ✅ Signup with email/password
- ✅ Login with JWT tokens
- ✅ Secure password hashing
- ✅ Auto-generated Solana wallets

### Wallet

- ✅ View balance (SOL, USDC, SKR)
- ✅ Send tokens
- ✅ Receive with QR code
- ✅ Transaction history
- ✅ Copy wallet address

### Trading

- ✅ Token swaps
- ✅ Live price quotes
- ✅ Market prices
- ✅ Price charts (24h change)

### Staking

- ✅ Multiple staking pools
- ✅ Stake/unstake tokens
- ✅ Claim rewards
- ✅ APY display

### Rewards

- ✅ Earn SKR tokens
- ✅ Daily check-in rewards
- ✅ Content creation rewards
- ✅ Engagement rewards

### Search

- ✅ Search users
- ✅ Search tokens
- ✅ Search posts
- ✅ Trending topics

### Profile

- ✅ View profile
- ✅ Edit settings
- ✅ Logout

## Next Steps

1. Explore the mobile app features
2. Try sending tokens between accounts
3. Swap some tokens
4. Stake tokens for rewards
5. Check out the search functionality
6. Customize the seed data
7. Build your own features!

## Support

Need help? Check:

- [SETUP_AND_SEED_GUIDE.md](./SETUP_AND_SEED_GUIDE.md) - Detailed setup
- [HOME_SCREENS_COMPLETE.md](./apps/mobile-app/HOME_SCREENS_COMPLETE.md) - Home features
- [AUTH_IMPLEMENTATION.md](./apps/mobile-app/AUTH_IMPLEMENTATION.md) - Auth system
- [SEARCH_IMPLEMENTATION.md](./apps/mobile-app/SEARCH_IMPLEMENTATION.md) - Search features
- [QR_CLIPBOARD_IMPLEMENTATION.md](./apps/mobile-app/QR_CLIPBOARD_IMPLEMENTATION.md) - QR & clipboard

Happy coding! 🎉
