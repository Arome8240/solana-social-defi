# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Clients                         │
│         (React Native Mobile / Next.js Web)                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/WSS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js API Server                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes → Controllers → Services → Models             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────┬──────────┬──────────┬──────────┬────────────┬────────┘
      │          │          │          │            │
      ▼          ▼          ▼          ▼            ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│ MongoDB  │ │ Solana │ │Jupiter │ │GetStream │ │  Cron    │
│          │ │  RPC   │ │  API   │ │   SDK    │ │  Jobs    │
└──────────┘ └────────┘ └────────┘ └──────────┘ └──────────┘
```

## Project Structure

```
solana-social-defi-backend/
├── src/
│   ├── index.ts                    # Application entry point
│   │
│   ├── config/                     # Configuration files
│   │   ├── database.ts             # MongoDB connection
│   │   └── swagger.ts              # API documentation setup
│   │
│   ├── models/                     # MongoDB schemas
│   │   ├── User.ts                 # User model (auth, wallet, balances)
│   │   ├── Post.ts                 # Post model (content, likes, comments)
│   │   ├── Token.ts                # Token/NFT model
│   │   ├── Trade.ts                # P2P trade model
│   │   └── MiniApp.ts              # Mini app model
│   │
│   ├── controllers/                # Request handlers
│   │   ├── authController.ts       # Auth logic (signup, login, wallet)
│   │   ├── socialController.ts     # Social features (posts, likes, comments)
│   │   ├── messageController.ts    # Messaging via GetStream
│   │   ├── defiController.ts       # DeFi operations (stake, lend)
│   │   ├── rewardController.ts     # Creator rewards (SKR distribution)
│   │   ├── tradeController.ts      # Trading (swaps, P2P)
│   │   ├── nftController.ts        # NFT operations (mint, transfer)
│   │   └── miniAppController.ts    # Mini app management
│   │
│   ├── services/                   # Business logic & external integrations
│   │   ├── solanaService.ts        # Solana blockchain interactions
│   │   ├── getstreamService.ts     # GetStream messaging client
│   │   ├── jupiterService.ts       # Jupiter swap aggregator
│   │   └── cronService.ts          # Scheduled tasks (rewards)
│   │
│   ├── routes/                     # API route definitions
│   │   ├── authRoutes.ts           # /api/auth/*
│   │   ├── socialRoutes.ts         # /api/social/*
│   │   ├── messageRoutes.ts        # /api/messages/*
│   │   ├── defiRoutes.ts           # /api/defi/*
│   │   ├── rewardRoutes.ts         # /api/rewards/*
│   │   ├── tradeRoutes.ts          # /api/trade/*
│   │   ├── nftRoutes.ts            # /api/nfts/*
│   │   └── miniAppRoutes.ts        # /api/mini-apps/*
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── auth.ts                 # JWT authentication & authorization
│   │   ├── errorHandler.ts         # Global error handling
│   │   ├── rateLimiter.ts          # Rate limiting
│   │   └── validation.ts           # Input validation (Joi schemas)
│   │
│   ├── utils/                      # Utility functions
│   │   └── logger.ts               # Winston logger configuration
│   │
│   └── __tests__/                  # Test files
│       └── auth.test.ts            # Auth endpoint tests
│
├── logs/                           # Application logs
├── scripts/                        # Utility scripts
│   └── setup.sh                    # Setup automation
│
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── jest.config.js                  # Jest test configuration
├── .eslintrc.js                    # ESLint configuration
├── nodemon.json                    # Nodemon configuration
├── Dockerfile                      # Docker image definition
├── docker-compose.yml              # Multi-container setup
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── SETUP.md                        # Setup instructions
├── API_EXAMPLES.md                 # API usage examples
└── ARCHITECTURE.md                 # This file
```

## Data Flow

### 1. Authentication Flow

```
Client → POST /api/auth/signup
         ↓
      Validation Middleware
         ↓
      authController.signup
         ↓
      Hash password (bcrypt)
         ↓
      Save to MongoDB
         ↓
      Generate JWT
         ↓
      Return token + user data
```

### 2. Social Post Creation Flow

```
Client → POST /api/social/posts (with JWT)
         ↓
      Auth Middleware (verify JWT)
         ↓
      Rate Limiter
         ↓
      Validation Middleware
         ↓
      socialController.createPost
         ↓
      Save to MongoDB
         ↓
      Return post data
```

### 3. Post Tokenization Flow

```
Client → POST /api/social/posts/:id/tokenize
         ↓
      Auth Middleware
         ↓
      socialController.tokenizePost
         ↓
      solanaService.createToken
         ↓
      Create SPL token on Solana
         ↓
      Update post in MongoDB
         ↓
      Return mint address
```

### 4. Gasless Transaction Flow

```
Client → Create partial transaction
         ↓
      Sign with user wallet
         ↓
      Send to backend API
         ↓
      solanaService.executeGaslessTransaction
         ↓
      Add fee payer signature
         ↓
      Broadcast to Solana RPC
         ↓
      Confirm transaction
         ↓
      Return signature
```

### 5. Creator Rewards Flow

```
Cron Job (daily) → cronService.distributeCreatorRewards
                   ↓
                Find all creators
                   ↓
                Calculate engagement (likes + comments)
                   ↓
                For each creator:
                   ↓
                solanaService.rewardSKR
                   ↓
                Mint SKR tokens to wallet
                   ↓
                Update user balance in DB
                   ↓
                Log transaction
```

## Key Components

### Authentication System

- **Web2 Login**: Email/password with bcrypt hashing
- **Web3 Login**: Solana wallet signature verification
- **Biometric Support**: Flag for frontend fingerprint authentication
- **JWT Tokens**: Stateless authentication with role-based access

### Social Features

- **Posts**: Text + media content
- **Nested Comments**: Unlimited depth with recursive structure
- **Likes**: On posts and comments (idempotent)
- **Tokenization**: Convert posts to tradeable SPL tokens
- **Feed**: Paginated, reverse chronological

### Messaging (GetStream)

- **Real-time Chat**: 1:1, group, and community channels
- **Activity Feeds**: Optional for social feed updates
- **Notifications**: Message and engagement alerts

### DeFi Integration

- **Staking**: SOL and SPL token staking
- **Lending**: Simple lending pools
- **Yields**: APY tracking from protocols
- **Jupiter Swaps**: Token exchange via aggregator

### Creator Economy

- **SKR Token**: Custom SPL token for rewards
- **Engagement-based**: Rewards for likes, comments, sales
- **Automated Distribution**: Daily cron job
- **Manual Claims**: Creator-initiated reward claims

### NFT System

- **Minting**: Create NFTs with metadata
- **Transfers**: P2P NFT transfers
- **Metadata**: On-chain and off-chain data
- **Collections**: User NFT galleries

### Mini Apps

- **Creator Platform**: Upload embeddable apps
- **Iframe Support**: Secure embedding
- **Discovery**: Browse and search mini apps

## Security Layers

1. **Authentication**: JWT with role-based access control
2. **Rate Limiting**: Prevent abuse and DDoS
3. **Input Validation**: Joi schemas for all inputs
4. **Password Hashing**: Bcrypt with 12 rounds
5. **Helmet**: HTTP security headers
6. **CORS**: Cross-origin resource sharing control
7. **Error Handling**: Sanitized error messages
8. **Logging**: Comprehensive audit trail

## Scalability Considerations

### Current Architecture (Monolith)

- Single Express.js server
- Direct MongoDB connection
- In-memory rate limiting
- File-based logging

### Future Scaling Options

1. **Horizontal Scaling**
   - Load balancer (Nginx/AWS ALB)
   - Multiple API instances (PM2 cluster)
   - Redis for shared rate limiting
   - Redis for session storage

2. **Database Optimization**
   - MongoDB replica sets
   - Read replicas for queries
   - Sharding for large datasets
   - Caching layer (Redis)

3. **Microservices Migration**
   - Auth service
   - Social service
   - DeFi service
   - Messaging service
   - Blockchain service

4. **Message Queue**
   - RabbitMQ/SQS for async tasks
   - Background job processing
   - Event-driven architecture

5. **CDN & Caching**
   - CloudFlare for static assets
   - Redis for API responses
   - Edge caching for feeds

## Technology Choices

### Why Express.js?

- Mature, battle-tested framework
- Large ecosystem of middleware
- Easy to understand and maintain
- Good performance for most use cases

### Why MongoDB?

- Flexible schema for evolving features
- Good performance for document queries
- Native support for nested data (comments)
- Easy horizontal scaling

### Why @solana/web3.js?

- Official Solana JavaScript SDK
- Comprehensive blockchain interaction
- Active development and support
- TypeScript support

### Why GetStream?

- Production-ready messaging
- Real-time capabilities
- Scalable infrastructure
- React Native SDK available

### Why Jupiter?

- Best swap rates on Solana
- Aggregates multiple DEXs
- Simple API integration
- High liquidity

## Deployment Architecture

### Development

```
Local Machine
├── Node.js (nodemon)
├── MongoDB (Docker)
└── Solana Devnet
```

### Production

```
Cloud Provider (AWS/GCP/Azure)
├── API Servers (EC2/Compute Engine)
│   ├── PM2 cluster mode
│   └── Auto-scaling group
├── MongoDB Atlas (managed)
├── Redis (ElastiCache/MemoryStore)
├── Load Balancer (ALB/Cloud Load Balancing)
├── CDN (CloudFront/Cloud CDN)
└── Monitoring (CloudWatch/Stackdriver)
```

## Monitoring & Observability

### Metrics to Track

- API response times
- Error rates
- Request throughput
- Database query performance
- Solana transaction success rate
- User engagement metrics
- SKR reward distribution

### Logging Strategy

- Application logs (Winston)
- Access logs (Morgan)
- Error tracking (Sentry)
- Transaction logs (blockchain)
- Audit logs (user actions)

### Alerting

- API downtime
- High error rates
- Database connection issues
- Solana RPC failures
- Low fee payer balance
- Failed reward distributions

## Future Enhancements

1. **WebSocket Support**: Real-time updates without GetStream
2. **GraphQL API**: Alternative to REST
3. **Push Notifications**: Mobile push via FCM/APNS
4. **Analytics Dashboard**: User and creator insights
5. **Content Moderation**: AI-powered content filtering
6. **Multi-chain Support**: Ethereum, Polygon, etc.
7. **Advanced DeFi**: Yield farming, liquidity pools
8. **Social Graph**: Follow/follower relationships
9. **Recommendation Engine**: Personalized feeds
10. **Admin Panel**: Content and user management
