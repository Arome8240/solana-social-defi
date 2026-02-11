# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] Environment variables configured
- [ ] Database backup strategy in place
- [ ] Monitoring and logging configured
- [ ] SSL certificates ready
- [ ] Domain name configured
- [ ] Solana mainnet RPC endpoint ready
- [ ] Fee payer wallet funded
- [ ] SKR token created on mainnet
- [ ] GetStream production credentials

## Environment Setup

### Production Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# MongoDB (use MongoDB Atlas or managed service)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solana-social-defi?retryWrites=true&w=majority

# JWT (use strong secret)
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRES_IN=7d

# Solana Mainnet
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
SOLANA_NETWORK=mainnet-beta
FEE_PAYER_PRIVATE_KEY=<base58-encoded-mainnet-key>
SKR_MINT_AUTHORITY_PRIVATE_KEY=<base58-encoded-mainnet-key>
SKR_TOKEN_MINT=<mainnet-skr-token-mint>

# GetStream Production
GETSTREAM_API_KEY=<production-api-key>
GETSTREAM_API_SECRET=<production-api-secret>
GETSTREAM_APP_ID=<production-app-id>

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

## Deployment Options

### Option 1: Docker Deployment

#### Build and Push to Registry

```bash
# Build image
docker build -t your-registry/solana-social-defi:latest .

# Push to registry (Docker Hub, ECR, GCR, etc.)
docker push your-registry/solana-social-defi:latest
```

#### Deploy with Docker Compose

```bash
# On production server
docker-compose up -d

# View logs
docker-compose logs -f api

# Scale API instances
docker-compose up -d --scale api=3
```

### Option 2: AWS Deployment

#### Using EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security group: Allow 80, 443, 22

2. **Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

3. **Deploy Application**

```bash
# Clone repository
git clone https://github.com/your-repo/solana-social-defi.git
cd solana-social-defi

# Install dependencies
pnpm install

# Build
pnpm build

# Create .env file
nano .env
# (paste production environment variables)

# Start with PM2
pm2 start dist/index.js --name solana-api -i max

# Save PM2 configuration
pm2 save
pm2 startup
```

4. **Configure Nginx**

```nginx
# /etc/nginx/sites-available/solana-api
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/solana-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Using ECS (Elastic Container Service)

1. **Create ECR Repository**

```bash
aws ecr create-repository --repository-name solana-social-defi
```

2. **Push Docker Image**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag solana-social-defi:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/solana-social-defi:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/solana-social-defi:latest
```

3. **Create ECS Task Definition**

```json
{
  "family": "solana-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/solana-social-defi:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [{ "name": "NODE_ENV", "value": "production" }],
      "secrets": [
        { "name": "MONGODB_URI", "valueFrom": "arn:aws:secretsmanager:..." },
        { "name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/solana-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

4. **Create ECS Service with ALB**

### Option 3: Heroku Deployment

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create solana-social-defi

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set SOLANA_RPC_URL=your-rpc-url
# ... (set all other env vars)

# Deploy
git push heroku main

# Scale
heroku ps:scale web=2

# View logs
heroku logs --tail
```

### Option 4: DigitalOcean App Platform

1. **Connect Repository**
   - Link GitHub/GitLab repository
   - Select branch

2. **Configure Build**
   - Build Command: `pnpm install && pnpm build`
   - Run Command: `node dist/index.js`

3. **Add Environment Variables**
   - Add all production env vars in dashboard

4. **Add MongoDB Database**
   - Use DigitalOcean Managed MongoDB
   - Or connect to MongoDB Atlas

5. **Deploy**
   - Click "Deploy"
   - App Platform handles scaling and SSL

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at mongodb.com/cloud/atlas
   - Create M10+ cluster for production
   - Choose region close to API servers

2. **Configure Security**
   - Add IP whitelist (or 0.0.0.0/0 for dynamic IPs)
   - Create database user
   - Enable encryption at rest

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Add to .env as MONGODB_URI

4. **Set Up Backups**
   - Enable continuous backups
   - Configure retention policy
   - Test restore procedure

## Solana Configuration

### Mainnet RPC Providers

Choose a reliable RPC provider:

1. **Helius** (Recommended)
   - Sign up at helius.dev
   - Get API key
   - URL: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`

2. **QuickNode**
   - Sign up at quicknode.com
   - Create Solana endpoint
   - Use provided URL

3. **Alchemy**
   - Sign up at alchemy.com
   - Create Solana app
   - Use provided URL

### Fund Fee Payer Wallet

```bash
# Check balance
solana balance <FEE_PAYER_PUBLIC_KEY> --url mainnet-beta

# Transfer SOL to fee payer
# Keep at least 1-2 SOL for transaction fees
```

### Monitor Fee Payer Balance

Set up alerts when balance drops below threshold:

```javascript
// Add to cronService.ts
cron.schedule("0 * * * *", async () => {
  const balance = await solanaService.getBalance(FEE_PAYER_ADDRESS);
  if (balance < 0.5) {
    // Send alert (email, Slack, PagerDuty)
    logger.error(`Low fee payer balance: ${balance} SOL`);
  }
});
```

## Monitoring & Logging

### Application Monitoring

#### Using PM2 Plus (for PM2 deployments)

```bash
# Link to PM2 Plus
pm2 link <secret_key> <public_key>

# Monitor at app.pm2.io
```

#### Using New Relic

```bash
# Install agent
pnpm add newrelic

# Add to index.ts (first line)
require('newrelic');

# Configure newrelic.js
```

#### Using Datadog

```bash
# Install agent
pnpm add dd-trace

# Add to index.ts (first line)
require('dd-trace').init();
```

### Log Aggregation

#### Using CloudWatch (AWS)

```bash
# Install CloudWatch agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure to send logs
```

#### Using Papertrail

```bash
# Add remote syslog
echo "*.* @logs.papertrailapp.com:PORT" | sudo tee -a /etc/rsyslog.conf
sudo service rsyslog restart
```

### Error Tracking

#### Using Sentry

```bash
# Install Sentry
pnpm add @sentry/node

# Add to index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Add to error handler
Sentry.captureException(error);
```

## Performance Optimization

### Enable Compression

```typescript
// Add to index.ts
import compression from "compression";
app.use(compression());
```

### Add Redis Caching

```bash
pnpm add redis ioredis
```

```typescript
// Create redis client
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL);

// Cache feed
const cachedFeed = await redis.get(`feed:${page}`);
if (cachedFeed) return JSON.parse(cachedFeed);

// Set cache with expiry
await redis.setex(`feed:${page}`, 300, JSON.stringify(feed));
```

### Database Indexing

Ensure indexes are created:

```javascript
// In models
UserSchema.index({ email: 1 });
UserSchema.index({ walletAddress: 1 });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ tokenized: 1 });
```

## Security Hardening

### Environment Variables

Use secrets manager:

```bash
# AWS Secrets Manager
aws secretsmanager create-secret --name solana-api-secrets --secret-string file://secrets.json

# Access in code
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const secret = await secretsManager.getSecretValue({ SecretId: 'solana-api-secrets' }).promise();
```

### Rate Limiting

Use Redis for distributed rate limiting:

```typescript
import { RateLimiterRedis } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 900,
});
```

### CORS Configuration

```typescript
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://app.yourdomain.com"],
    credentials: true,
  }),
);
```

## Backup Strategy

### Database Backups

```bash
# Automated daily backups
0 2 * * * mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)

# Retention: Keep 30 days
find /backups -type d -mtime +30 -exec rm -rf {} \;
```

### Wallet Backups

- Store keypair JSON files in secure location
- Use hardware security module (HSM) for production
- Keep offline backups of private keys

## Rollback Plan

### Quick Rollback

```bash
# With PM2
pm2 deploy production revert 1

# With Docker
docker-compose down
docker-compose up -d --force-recreate

# With Kubernetes
kubectl rollout undo deployment/solana-api
```

### Database Rollback

```bash
# Restore from backup
mongorestore --uri="$MONGODB_URI" /backups/20240211
```

## Health Checks

### Kubernetes Liveness/Readiness

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Load Balancer Health Check

Configure ALB/ELB to check `/health` endpoint every 30 seconds.

## Post-Deployment

1. **Verify Deployment**
   - Check health endpoint
   - Test critical APIs
   - Verify database connection
   - Check Solana transactions

2. **Monitor Metrics**
   - Response times
   - Error rates
   - Database performance
   - Memory/CPU usage

3. **Set Up Alerts**
   - API downtime
   - High error rate
   - Database issues
   - Low fee payer balance

4. **Documentation**
   - Update API documentation
   - Document any changes
   - Update runbooks

## Troubleshooting

### High Memory Usage

```bash
# Check memory
pm2 monit

# Restart if needed
pm2 restart solana-api

# Increase memory limit
pm2 start dist/index.js --max-memory-restart 1G
```

### Database Connection Issues

```bash
# Check MongoDB status
mongosh "$MONGODB_URI" --eval "db.serverStatus()"

# Check connection pool
# Add to code: mongoose.connection.on('connected', () => ...)
```

### Solana RPC Issues

```bash
# Test RPC
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' $SOLANA_RPC_URL

# Switch to backup RPC if needed
```

## Support & Maintenance

- Monitor error logs daily
- Review performance metrics weekly
- Update dependencies monthly
- Security audit quarterly
- Disaster recovery drill annually
