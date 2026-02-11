# Solana Social DeFi Backend

Production-ready backend API for an all-in-one Solana mobile app with social features, DeFi, messaging, NFTs, and mini-apps.

## Features

- **Authentication**: Email/password login with bcrypt, Solana wallet connect, biometric support
- **Social**: Posts with likes/comments (nested), tokenize posts to sellable tokens/NFTs
- **Messaging**: Real-time chat via GetStream SDK (1:1, groups, communities)
- **DeFi**: Staking, lending, yield tracking
- **Creator Rewards**: SKR token rewards based on engagement (likes, comments, token sales)
- **Trading**: Token swaps via Jupiter, P2P trades
- **NFTs**: Mint, transfer, and manage NFTs
- **Mini Apps**: Creator-uploaded embeddable apps
- **Gasless Transactions**: Fee payer sponsorship for all on-chain actions

## Tech Stack

- Node.js v20+
- Express.js
- TypeScript
- MongoDB + Mongoose
- @solana/web3.js
- @solana/spl-token
- GetStream.io SDK
- JWT + Bcrypt
- Winston (logging)
- Swagger (API docs)
- Jest (testing)

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

## Configuration

Edit `.env` file with your settings:

- MongoDB connection string
- Solana RPC URL (devnet/mainnet)
- Fee payer private key (base58 encoded)
- SKR token mint authority
- GetStream credentials
- JWT secret

## Running

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Tests
pnpm test

# Linting
pnpm lint
```

## API Documentation

Once running, visit: `http://localhost:3000/api-docs`

## Key Endpoints

### Auth

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/wallet-connect` - Wallet login
- `PATCH /api/auth/biometric` - Toggle biometric

### Social

- `POST /api/social/posts` - Create post
- `GET /api/social/posts/:id` - Get post
- `POST /api/social/posts/:id/like` - Like post
- `POST /api/social/posts/:id/comment` - Comment on post
- `POST /api/social/posts/:id/tokenize` - Convert post to token
- `GET /api/social/feed` - Get feed

### Messaging

- `POST /api/messages/channels` - Create channel
- `POST /api/messages/send` - Send message
- `GET /api/messages/channels/:id` - Get messages

### DeFi

- `POST /api/defi/stake` - Stake tokens
- `POST /api/defi/lend` - Lend tokens
- `GET /api/defi/yields` - Get yields

### Rewards

- `POST /api/rewards/claim` - Claim SKR rewards
- `GET /api/rewards/summary` - Get rewards summary

### Trade

- `POST /api/trade/swap` - Token swap via Jupiter
- `POST /api/trade/p2p` - Create P2P trade
- `POST /api/trade/p2p/:id/accept` - Accept trade
- `GET /api/trade/history` - Trade history

### NFTs

- `POST /api/nfts/mint` - Mint NFT
- `POST /api/nfts/transfer` - Transfer NFT
- `GET /api/nfts/:mint` - Get NFT details
- `GET /api/nfts/user/collection` - User's NFTs

### Mini Apps

- `POST /api/mini-apps` - Create mini app
- `GET /api/mini-apps/:id` - Get mini app
- `PATCH /api/mini-apps/:id` - Update mini app
- `GET /api/mini-apps` - List mini apps

## Docker

```bash
# Build image
docker build -t solana-social-defi .

# Run container
docker run -p 3000:3000 --env-file .env solana-social-defi
```

## Architecture

```
src/
├── index.ts              # Entry point
├── config/               # Configuration
│   ├── database.ts
│   └── swagger.ts
├── models/               # MongoDB schemas
│   ├── User.ts
│   ├── Post.ts
│   ├── Token.ts
│   ├── Trade.ts
│   └── MiniApp.ts
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── socialController.ts
│   ├── messageController.ts
│   ├── defiController.ts
│   ├── rewardController.ts
│   ├── tradeController.ts
│   ├── nftController.ts
│   └── miniAppController.ts
├── routes/               # API routes
├── services/             # Business logic
│   ├── solanaService.ts
│   ├── getstreamService.ts
│   ├── jupiterService.ts
│   └── cronService.ts
├── middleware/           # Express middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── validation.ts
└── utils/                # Utilities
    └── logger.ts
```

## Security

- JWT authentication with role-based access
- Bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min, stricter for auth)
- Helmet for HTTP headers
- Input validation with Joi
- Secure wallet key management

## Gasless Transactions

All on-chain operations support gasless execution:

1. Frontend creates partial transaction
2. User signs transaction
3. Backend adds fee payer signature
4. Backend broadcasts to Solana

## Creator Rewards (SKR)

- Automated daily distribution via cron
- Rewards based on:
  - Likes: 0.1 SKR per like
  - Comments: 0.5 SKR per comment
  - Token sales: 10 SKR per sale
- Manual claim endpoint for creators

## License

MIT
