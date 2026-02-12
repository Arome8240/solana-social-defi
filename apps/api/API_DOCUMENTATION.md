# Solana Social DeFi API Documentation

## Overview

Production-ready backend API for Solana mobile app with social, DeFi, messaging, and NFT features.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://api.solana-social.com`

## Interactive Documentation

Visit `/api-docs` for interactive Swagger documentation:

- Local: http://localhost:3000/api-docs

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get your token by logging in or signing up through the `/api/auth/login` or `/api/auth/signup` endpoints.

## Test Accounts

After running the seed script (`npm run seed`), you can use these test accounts:

| Email               | Password    | Role    | SKR Balance | SOL Balance |
| ------------------- | ----------- | ------- | ----------- | ----------- |
| dev@arome.com       | password123 | admin   | 1000        | 10          |
| alice@example.com   | password123 | creator | 500         | 5           |
| bob@example.com     | password123 | user    | 250         | 2.5         |
| charlie@example.com | password123 | user    | 750         | 7.5         |
| diana@example.com   | password123 | creator | 600         | 6           |

## API Endpoints

### Authentication (`/api/auth`)

- `POST /signup` - Create new account with auto-generated wallet
- `POST /login` - Login with email and password
- `PATCH /biometric` - Toggle biometric authentication
- `POST /export-private-key` - Export wallet private key (requires password)
- `GET /wallet` - Get wallet information and balances

### Social (`/api/social`)

- `POST /posts` - Create a new post
- `GET /posts/:id` - Get specific post
- `POST /posts/:id/like` - Like/unlike a post
- `POST /posts/:id/comment` - Comment on a post
- `POST /posts/:id/tokenize` - Tokenize post as NFT
- `GET /feed` - Get social feed
- `POST /comments/:commentId/like` - Like/unlike a comment
- `POST /comments/:commentId/reply` - Reply to a comment

### Trades (`/api/trades`)

- `POST /swap` - Swap tokens using Jupiter aggregator
- `POST /p2p` - Create peer-to-peer trade offer
- `POST /p2p/:id/accept` - Accept pending P2P trade
- `GET /history` - Get user's trade history

### DeFi (`/api/defi`)

- `POST /stake` - Stake tokens in a pool
- `POST /lend` - Lend tokens to earn interest
- `GET /yields` - Get available yield opportunities

### NFTs (`/api/nfts`)

- `POST /mint` - Mint a new NFT
- `POST /transfer` - Transfer NFT to another user
- `GET /:mint` details by mint address
- `GET /user/collection` - Get user's NFT collection

### Rewards (`/api/rewards`)

- `POST /claim` - Claim accumulated SKR rewards (creators/admins only)
- `GET /summary` - Get user's rewards summary

### Messages (`/api/messages`)

- `POST /channels` - Create a new message channel
- `POST /send` - Send a message to a channel
- `GET /channels/:id` - Get messages from a channel
- `GET /token` - Get GetStream user token for real-time messaging

### Mini Apps (`/api/mini-apps`)

- `POST /` - Create a new mini app
- `GET /` - List all mini apps
- `GET /:id` - Get mini app details
- `PATCH /:id` - Update mini app

## Quick Start

1. Start the API server:

```bash
cd apps/api
npm run dev
```

2. Seed the database with test data:

```bash
npm run seed
```

3. Visit the Swagger docs:

```
http://localhost:3000/api-docs
```

4. Test authentication:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@arome.com","password":"password123"}'
```

5. Use the returned token for authenticated requests:

```bash
curl http://localhost:3000/api/auth/wallet \
  -H "Authorization: Bearer <your-token>"
```

## Database Models

### User

- `username` - Unique username
- `email` - User email
- `walletAddress` - Solana wallet public key
- `encryptedPrivateKey` - Encrypted wallet private key
- `role` - User role (user, creator, admin)
- `balances` - Token balances (SOL, SKR)
- `biometricEnabled` - Biometric auth status

### Trade

- `fromUserId` - Sender user ID
- `toUserId` - Recipient user ID
- `tokenMint` - Token mint address
- `amount` - Trade amount
- `status` - Trade status (pending, completed, cancelled)
- `txSignature` - Solana transaction signature

### Post

- `userId` - Post author ID
- `content` - Post content
- `media` - Media URLs array
- `likes` - Array of user IDs who liked
- `comments` - Array of comment objects
- `likeCount` - Total likes
- `commentCount` - Total comments

### Token

- `mintAddress` - Token mint address
- `ownerId` - Token owner ID
- `metadata` - Token metadata (name, symbol, description, image)
- `type` - Token type (token, nft)
- `decimals` - Token decimals
- `supply` - Total supply

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- Standard endpoints: 100 requests per 15 minutes
- Strict endpoints (auth): 5 requests per 15 minutes

## Environment Variables

See `.env.example` for required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `SOLANA_RPC_URL` - Solana RPC endpoint
- `WALLET_ENCRYPTION_KEY` - Key for encrypting private keys

## Support

For issues or questions, contact: dev@arome.com
