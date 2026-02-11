# Solana Social DeFi - Monorepo

Production-ready monorepo for an all-in-one Solana mobile app with social features, DeFi, messaging, NFTs, and more.

## 🚀 Quick Start

```bash
# Install pnpm globally
npm install -g pnpm

# Install all dependencies
pnpm install

# Start development servers
pnpm dev

# Or run specific app
pnpm dev:api        # Backend API only
pnpm dev:mobile     # Mobile app only
```

## 📦 Monorepo Structure

```
├── apps/
│   ├── api/              # Backend API (Node.js + Express + Solana)
│   └── mobile-app/       # Mobile App (React Native)
├── packages/
│   └── shared/           # Shared types, constants, utilities
├── docs/                 # Documentation
└── package.json          # Root configuration
```

## 🎯 Features

### Backend API (`apps/api`)

- **Authentication**: Email/password with auto-generated custodial wallets
- **Social**: Posts, likes, nested comments, tokenization
- **Messaging**: Real-time chat via GetStream SDK
- **DeFi**: Staking, lending, yield tracking
- **Creator Rewards**: SKR token rewards based on engagement
- **Trading**: Token swaps (Jupiter), P2P trades
- **NFTs**: Mint, transfer, manage NFTs
- **Mini Apps**: Creator-uploaded embeddable apps
- **Gasless Transactions**: Fee payer sponsorship

### Mobile App (`apps/mobile-app`)

- Coming soon...

### Shared Package (`packages/shared`)

- Common TypeScript types
- API route constants
- Utility functions
- Validation helpers

## 🛠️ Tech Stack

### Backend

- Node.js v20+ & TypeScript
- Express.js
- MongoDB + Mongoose
- @solana/web3.js & @solana/spl-token
- GetStream.io SDK
- JWT + Bcrypt
- Winston (logging)
- Swagger (API docs)

### Mobile

- React Native
- TypeScript
- (More details coming soon)

### Monorepo

- pnpm workspaces
- Shared TypeScript packages
- Parallel development

## 📚 Documentation

- [Monorepo Guide](./MONOREPO_GUIDE.md) - Workspace management
- [API Documentation](./apps/api/README.md) - Backend API details
- [Setup Guide](./apps/api/SETUP.md) - Installation instructions
- [Architecture](./apps/api/ARCHITECTURE.md) - System design
- [Deployment](./apps/api/DEPLOYMENT.md) - Production deployment
- [Custodial Wallets](./CUSTODIAL_WALLETS.md) - Wallet management
- [API Examples](./apps/api/API_EXAMPLES.md) - Usage examples

## 🔧 Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Servers

```bash
# All apps in parallel
pnpm dev

# Specific app
pnpm dev:api
pnpm dev:mobile
```

### Build

```bash
# Build all
pnpm build

# Build specific
pnpm build:api
pnpm build:mobile
```

### Test

```bash
# Test all
pnpm test

# Test specific
pnpm test:api
pnpm test:mobile
```

### Lint

```bash
pnpm lint
```

## 🌐 API Endpoints

Once the API is running, visit:

- API: `http://localhost:3000`
- API Docs: `http://localhost:3000/api-docs`
- Health: `http://localhost:3000/health`

### Key Endpoints

**Auth**

- `POST /api/auth/signup` - Create account (auto-generates wallet)
- `POST /api/auth/login` - Login
- `GET /api/auth/wallet` - Get wallet info
- `POST /api/auth/export-private-key` - Export private key

**Social**

- `POST /api/social/posts` - Create post
- `GET /api/social/feed` - Get feed
- `POST /api/social/posts/:id/like` - Like post
- `POST /api/social/posts/:id/comment` - Comment
- `POST /api/social/posts/:id/tokenize` - Convert to token

**Rewards**

- `POST /api/rewards/claim` - Claim SKR rewards
- `GET /api/rewards/summary` - Get rewards summary

**NFTs**

- `POST /api/nfts/mint` - Mint NFT
- `POST /api/nfts/transfer` - Transfer NFT
- `GET /api/nfts/user/collection` - Get collection

**Trade**

- `POST /api/trade/swap` - Token swap (Jupiter)
- `POST /api/trade/p2p` - P2P trade
- `GET /api/trade/history` - Trade history

## 🔐 Environment Setup

### API Environment Variables

Copy `apps/api/.env.example` to `apps/api/.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/solana-social-defi

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Wallet Encryption
WALLET_ENCRYPTION_KEY=your-encryption-key-min-32-chars

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
FEE_PAYER_PRIVATE_KEY=your-base58-key
SKR_MINT_AUTHORITY_PRIVATE_KEY=your-base58-key
SKR_TOKEN_MINT=your-token-mint-address

# GetStream
GETSTREAM_API_KEY=your-api-key
GETSTREAM_API_SECRET=your-api-secret
GETSTREAM_APP_ID=your-app-id
```

## 🐳 Docker

### API with Docker Compose

```bash
cd apps/api
docker-compose up
```

## 📦 Package Management

### Add dependency to workspace

```bash
# Add to API
pnpm --filter @solana-social/api add express

# Add to mobile app
pnpm --filter @solana-social/mobile-app add react-native

# Add to shared
pnpm --filter @solana-social/shared add lodash
```

### Use shared package

In `apps/api/package.json` or `apps/mobile-app/package.json`:

```json
{
  "dependencies": {
    "@solana-social/shared": "workspace:*"
  }
}
```

Then import:

```typescript
import { User, API_ROUTES, formatSolAmount } from "@solana-social/shared";
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run API tests
pnpm test:api

# Run with coverage
pnpm --filter @solana-social/api test -- --coverage
```

## � Deployment

### API Deployment

See [Deployment Guide](./apps/api/DEPLOYMENT.md) for detailed instructions.

Quick deploy:

```bash
cd apps/api
pnpm build
pnpm start
```

### Mobile App Deployment

Follow React Native deployment guides for iOS and Android.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Run linter: `pnpm lint`
6. Commit with conventional commits
7. Push and create a pull request

## 📄 License

MIT

## 🔗 Links

- [API Documentation](http://localhost:3000/api-docs)
- [Postman Collection](./apps/api/postman_collection.json)
- [Solana Documentation](https://docs.solana.com/)
- [GetStream Documentation](https://getstream.io/docs/)

## 💡 Key Features Explained

### Custodial Wallets

Users don't need external wallets. The system automatically creates and manages Solana wallets for each user. Private keys are encrypted and stored securely. Users can export their private keys anytime.

### Creator Rewards (SKR)

Creators earn SKR tokens based on engagement:

- 0.1 SKR per like
- 0.5 SKR per comment
- 10 SKR per token sale

Rewards are distributed daily via cron jobs.

### Gasless Transactions

All blockchain operations are sponsored by the backend's fee payer, providing a seamless Web2-like experience.

### Post Tokenization

Creators can convert their posts into tradeable SPL tokens or NFTs, creating a creator economy.

## 🆘 Support

- Check [Documentation](./docs/)
- Open an [Issue](https://github.com/your-repo/issues)
- Read [Monorepo Guide](./MONOREPO_GUIDE.md)

## 🎯 Roadmap

- [x] Backend API with custodial wallets
- [x] Social features (posts, likes, comments)
- [x] DeFi integration (staking, lending)
- [x] NFT minting and trading
- [x] Creator rewards system
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Multi-chain support

---

Built with ❤️ using Solana, Node.js, and React Native
