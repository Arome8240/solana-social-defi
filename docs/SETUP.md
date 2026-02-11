# Setup Guide

## Prerequisites

- Node.js v20+
- pnpm (install: `npm install -g pnpm`)
- MongoDB (local or cloud)
- Solana CLI (for generating keypairs)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate Solana Keypairs

You need two keypairs:

1. Fee payer (for gasless transactions)
2. SKR mint authority (for reward distribution)

```bash
# Install Solana CLI if not already installed
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate fee payer keypair
solana-keygen new --outfile fee-payer.json

# Generate SKR mint authority keypair
solana-keygen new --outfile skr-mint-authority.json

# Get base58 encoded private keys
# You'll need to convert the JSON keypairs to base58 format
# Use this Node.js script:
node -e "const fs = require('fs'); const bs58 = require('bs58'); const key = JSON.parse(fs.readFileSync('fee-payer.json')); console.log(bs58.encode(Buffer.from(key)));"
```

### 3. Create SKR Token

```bash
# Set Solana to devnet
solana config set --url devnet

# Airdrop SOL to fee payer for testing
solana airdrop 2 <FEE_PAYER_PUBLIC_KEY> --url devnet

# Create SKR token mint
spl-token create-token --decimals 9 skr-mint-authority.json

# Save the mint address for .env
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/solana-social-defi

# JWT
JWT_SECRET=<generate-random-secret>
JWT_EXPIRES_IN=7d

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
FEE_PAYER_PRIVATE_KEY=<base58-encoded-fee-payer-key>
SKR_MINT_AUTHORITY_PRIVATE_KEY=<base58-encoded-mint-authority-key>
SKR_TOKEN_MINT=<your-skr-token-mint-address>

# GetStream (sign up at https://getstream.io)
GETSTREAM_API_KEY=<your-api-key>
GETSTREAM_API_SECRET=<your-api-secret>
GETSTREAM_APP_ID=<your-app-id>

# Jupiter
JUPITER_API_URL=https://quote-api.jup.ag/v6

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Rewards
DAILY_REWARD_CRON=0 0 * * *
SKR_PER_LIKE=0.1
SKR_PER_COMMENT=0.5
SKR_PER_TOKEN_SALE=10

# Logging
LOG_LEVEL=info
```

### 5. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use docker-compose
docker-compose up -d mongodb
```

### 6. Run the Application

```bash
# Development mode
pnpm dev

# Production mode
pnpm build
pnpm start
```

### 7. Test the API

Visit `http://localhost:3000/api-docs` for Swagger documentation.

Test health endpoint:

```bash
curl http://localhost:3000/health
```

## GetStream Setup

1. Sign up at https://getstream.io
2. Create a new app
3. Get your API credentials from the dashboard
4. Add credentials to `.env`

## Production Deployment

### Using Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Environment Variables for Production

- Change `NODE_ENV` to `production`
- Use mainnet RPC URL (e.g., Helius, QuickNode)
- Set strong `JWT_SECRET`
- Use MongoDB Atlas or managed MongoDB
- Enable proper logging and monitoring

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

### Solana Transaction Failures

- Ensure fee payer has sufficient SOL
- Check RPC URL is accessible
- Verify keypairs are correctly encoded

### GetStream Errors

- Verify API credentials
- Check GetStream dashboard for quota limits
- Ensure app ID matches your GetStream app

## Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test -- --coverage
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Secure keypair storage (use secrets manager in production)
- [ ] Enable HTTPS in production
- [ ] Configure CORS for your frontend domain
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific RPC endpoints
- [ ] Implement proper logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Next Steps

1. Integrate with frontend (React Native/Next.js)
2. Set up CI/CD pipeline
3. Configure monitoring (e.g., Datadog, New Relic)
4. Set up error tracking (e.g., Sentry)
5. Implement caching layer (Redis)
6. Add more comprehensive tests
7. Set up staging environment
8. Configure backup strategy for MongoDB
