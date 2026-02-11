# API Examples

## Authentication

### Sign Up (Email/Password)

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

Response:

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "biometricEnabled": false
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Wallet Connect

```bash
curl -X POST http://localhost:3000/api/auth/wallet-connect \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "signature": "base58-encoded-signature",
    "message": "Sign in to Solana Social DeFi"
  }'
```

### Toggle Biometric

```bash
curl -X PATCH http://localhost:3000/api/auth/biometric \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "biometricEnabled": true
  }'
```

## Social Features

### Create Post

```bash
curl -X POST http://localhost:3000/api/social/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Just launched my first NFT collection on Solana! 🚀",
    "media": ["https://example.com/image1.jpg"]
  }'
```

### Get Post

```bash
curl http://localhost:3000/api/social/posts/POST_ID
```

### Like Post

```bash
curl -X POST http://localhost:3000/api/social/posts/POST_ID/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Comment on Post

```bash
curl -X POST http://localhost:3000/api/social/posts/POST_ID/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "text": "Amazing work! Love the art style 🎨"
  }'
```

### Like Comment

```bash
curl -X POST http://localhost:3000/api/social/comments/COMMENT_ID/like \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "postId": "POST_ID"
  }'
```

### Reply to Comment

```bash
curl -X POST http://localhost:3000/api/social/comments/COMMENT_ID/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "postId": "POST_ID",
    "text": "Thanks for the feedback!"
  }'
```

### Tokenize Post

```bash
curl -X POST http://localhost:3000/api/social/posts/POST_ID/tokenize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Feed

```bash
curl "http://localhost:3000/api/social/feed?page=1&limit=20"
```

## Messaging

### Get GetStream Token

```bash
curl http://localhost:3000/api/messages/token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Channel

```bash
curl -X POST http://localhost:3000/api/messages/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "messaging",
    "channelId": "general-chat",
    "members": ["user1_id", "user2_id"],
    "name": "General Discussion"
  }'
```

### Send Message

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "channelType": "messaging",
    "channelId": "general-chat",
    "text": "Hello everyone!"
  }'
```

### Get Channel Messages

```bash
curl "http://localhost:3000/api/messages/channels/CHANNEL_ID?limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## DeFi

### Stake Tokens

```bash
curl -X POST http://localhost:3000/api/defi/stake \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100,
    "tokenMint": "So11111111111111111111111111111111111111112"
  }'
```

### Lend Tokens

```bash
curl -X POST http://localhost:3000/api/defi/lend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50,
    "tokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  }'
```

### Get Yields

```bash
curl http://localhost:3000/api/defi/yields
```

## Rewards

### Claim Rewards (Creators Only)

```bash
curl -X POST http://localhost:3000/api/rewards/claim \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Rewards Summary

```bash
curl http://localhost:3000/api/rewards/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:

```json
{
  "currentBalance": 125.5,
  "pendingRewards": 45.2,
  "totalLikes": 320,
  "totalComments": 84,
  "totalPosts": 15
}
```

## Trading

### Token Swap (Jupiter)

```bash
curl -X POST http://localhost:3000/api/trade/swap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": 1000000000
  }'
```

### Create P2P Trade

```bash
curl -X POST http://localhost:3000/api/trade/p2p \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "toUserId": "507f1f77bcf86cd799439012",
    "tokenMint": "YOUR_TOKEN_MINT",
    "amount": 100
  }'
```

### Accept P2P Trade

```bash
curl -X POST http://localhost:3000/api/trade/p2p/TRADE_ID/accept \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Trade History

```bash
curl http://localhost:3000/api/trade/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## NFTs

### Mint NFT

```bash
curl -X POST http://localhost:3000/api/nfts/mint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Cool NFT #1",
    "symbol": "COOL",
    "uri": "https://arweave.net/metadata.json",
    "description": "A unique digital collectible",
    "image": "https://arweave.net/image.png"
  }'
```

### Transfer NFT

```bash
curl -X POST http://localhost:3000/api/nfts/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "mintAddress": "NFT_MINT_ADDRESS",
    "toWalletAddress": "RECIPIENT_WALLET_ADDRESS"
  }'
```

### Get NFT Details

```bash
curl http://localhost:3000/api/nfts/NFT_MINT_ADDRESS
```

### Get User's NFT Collection

```bash
curl http://localhost:3000/api/nfts/user/collection \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Mini Apps

### Create Mini App

```bash
curl -X POST http://localhost:3000/api/mini-apps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Token Price Tracker",
    "embedUrl": "https://example.com/mini-app",
    "description": "Real-time token price tracking"
  }'
```

### Get Mini App

```bash
curl http://localhost:3000/api/mini-apps/MINI_APP_ID
```

### Update Mini App

```bash
curl -X PATCH http://localhost:3000/api/mini-apps/MINI_APP_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "active": false
  }'
```

### List Mini Apps

```bash
curl "http://localhost:3000/api/mini-apps?page=1&limit=20"
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:

- `AUTH_NO_TOKEN` - No authentication token provided
- `AUTH_INVALID_TOKEN` - Invalid or expired token
- `AUTH_UNAUTHORIZED` - Unauthorized access
- `AUTH_FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Input validation failed
- `USER_EXISTS` - User already exists
- `USER_NOT_FOUND` - User not found
- `POST_NOT_FOUND` - Post not found
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

- Default: 100 requests per 15 minutes
- Auth endpoints: 10 requests per minute
- Returns 429 status code when exceeded

## Pagination

List endpoints support pagination:

```bash
curl "http://localhost:3000/api/social/feed?page=2&limit=10"
```

Response includes pagination metadata:

```json
{
  "posts": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```
