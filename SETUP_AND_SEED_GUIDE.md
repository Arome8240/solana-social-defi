# Setup and Seed Data Guide

## Quick Start - Create Test Account

### Option 1: Quick Seed (Recommended for Testing)

Creates a single test account instantly:

```bash
# Navigate to API directory
cd apps/api

# Install dependencies (if not already done)
pnpm install

# Run quick seed
pnpm run seed:quick
```

**Test Account Credentials:**

- Email: `test@example.com`
- Password: `password123`
- Username: `testuser`
- Initial SKR Balance: 100
- Initial SOL Balance: 1

### Option 2: Full Seed (Complete Demo Data)

Creates multiple users, tokens, posts, and trades:

```bash
cd apps/api
pnpm run seed
```

**Test Accounts Created:**

1. **Admin Account**
   - Email: `dev@arome.com`
   - Password: `password123`
   - Username: `devarome`
   - Role: Admin
   - SKR: 1000, SOL: 10

2. **Creator Account**
   - Email: `alice@example.com`
   - Password: `password123`
   - Username: `alice_crypto`
   - Role: Creator
   - SKR: 500, SOL: 5

3. **User Account**
   - Email: `bob@example.com`
   - Password: `password123`
   - Username: `bob_trader`
   - Role: User
   - SKR: 250, SOL: 2.5

4. **DeFi User**
   - Email: `charlie@example.com`
   - Password: `password123`
   - Username: `charlie_defi`
   - Role: User
   - SKR: 750, SOL: 7.5

5. **NFT Creator**
   - Email: `diana@example.com`
   - Password: `password123`
   - Username: `diana_nft`
   - Role: Creator
   - SKR: 600, SOL: 6

## Setup Instructions

### 1. Prerequisites

Ensure you have:

- Node.js 18+ installed
- MongoDB running (local or cloud)
- pnpm installed globally

```bash
npm install -g pnpm
```

### 2. Environment Setup

Create `.env` file in `apps/api/`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/solana-social

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Encryption
ENCRYPTION_KEY=your-32-character-secret-key-here

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:8081,exp://192.168.1.100:8081
```

### 3. Install Dependencies

```bash
# Root directory
pnpm install

# Or install for specific workspace
cd apps/api
pnpm install
```

### 4. Start MongoDB

**Option A: Local MongoDB**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: Docker**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas**

- Create free cluster at mongodb.com/cloud/atlas
- Get connection string
- Update MONGODB_URI in .env

### 5. Run Seed Scripts

**Quick Seed (Single Test Account):**

```bash
cd apps/api
pnpm run seed:quick
```

**Full Seed (Complete Demo Data):**

```bash
cd apps/api
pnpm run seed
```

### 6. Start the API Server

```bash
cd apps/api
pnpm run dev
```

Server will start on `http://localhost:3000`

### 7. Start the Mobile App

```bash
cd apps/mobile-app
pnpm run start
```

Then:

- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## Package.json Scripts

Add these scripts to `apps/api/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "seed": "ts-node src/scripts/seedData.ts",
    "seed:quick": "ts-node src/scripts/quickSeed.ts",
    "test": "jest"
  }
}
```

## Testing the Setup

### 1. Test API Health

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:

```json
{
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "walletAddress": "...",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Test Mobile App Login

1. Open mobile app
2. Navigate to Login screen
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Tap "Sign in"
5. Should redirect to Home screen

## Seeded Data Overview

### Users (5 accounts)

- Various roles: admin, creator, user
- Different balance levels
- Unique Solana wallets

### Tokens (6 tokens)

- SOL (Solana)
- USDC (USD Coin)
- USDT (Tether)
- SKR (Seeker Token)
- RAY (Raydium)
- BONK (Bonk)

### Posts (8 posts)

- From different users
- Various engagement levels
- Social content examples

### Trades (4 trades)

- Swap transactions
- Staking transactions
- Completed status
- Transaction hashes

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**

1. Check if MongoDB is running:

   ```bash
   # macOS/Linux
   ps aux | grep mongod

   # Windows
   tasklist | findstr mongod
   ```

2. Start MongoDB:

   ```bash
   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

3. Verify connection string in `.env`

### Seed Script Errors

**Error:** `Cannot find module '@solana/web3.js'`

**Solution:**

```bash
cd apps/api
pnpm install @solana/web3.js bs58 bcrypt
```

**Error:** `User validation failed: email: Path 'email' is required`

**Solution:**

- Check User model schema
- Ensure all required fields are provided
- Verify MongoDB connection

### API Not Starting

**Error:** `Port 3000 is already in use`

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### Mobile App Can't Connect

**Error:** `Network request failed`

**Solution:**

1. Check API is running: `curl http://localhost:3000/health`
2. Update API URL in mobile app:
   - For Android emulator: `http://10.0.2.2:3000`
   - For iOS simulator: `http://localhost:3000`
   - For physical device: `http://YOUR_IP:3000`
3. Check CORS settings in API
4. Ensure devices are on same network

## Reset Database

To clear all data and start fresh:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use solana-social

# Drop all collections
db.dropDatabase()

# Exit
exit

# Run seed again
cd apps/api
pnpm run seed
```

## Production Considerations

### Security

- Change all default passwords
- Use strong JWT_SECRET
- Use proper ENCRYPTION_KEY (32 characters)
- Enable HTTPS
- Set secure CORS origins
- Use environment variables for secrets

### Database

- Use MongoDB Atlas or managed service
- Enable authentication
- Set up backups
- Use connection pooling
- Add indexes for performance

### API

- Use production Solana RPC
- Implement rate limiting
- Add request validation
- Set up logging
- Use PM2 or similar for process management

### Monitoring

- Set up error tracking (Sentry)
- Add performance monitoring
- Log important events
- Set up alerts

## Next Steps

1. ✅ Create test account
2. ✅ Start API server
3. ✅ Start mobile app
4. ✅ Test login
5. ✅ Explore features
6. 🔄 Customize seed data
7. 🔄 Add more test scenarios
8. 🔄 Deploy to production

## Support

If you encounter issues:

1. Check this guide
2. Review error messages
3. Check API logs
4. Verify environment variables
5. Ensure all services are running

## Quick Reference

**Start Everything:**

```bash
# Terminal 1 - MongoDB (if local)
mongod

# Terminal 2 - API
cd apps/api && pnpm run dev

# Terminal 3 - Mobile App
cd apps/mobile-app && pnpm run start
```

**Test Credentials:**

- Email: `test@example.com`
- Password: `password123`

**API Endpoints:**

- Health: `GET /health`
- Login: `POST /api/auth/login`
- Signup: `POST /api/auth/signup`
- Wallet: `GET /api/auth/wallet`

**Default Ports:**

- API: 3000
- MongoDB: 27017
- Expo: 8081
