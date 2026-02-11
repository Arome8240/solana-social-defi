#!/bin/bash

echo "🚀 Solana Social DeFi Backend Setup"
echo "===================================="

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js v20+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm installed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration"
else
    echo "✅ .env file exists"
fi

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Check if MongoDB is running
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" > /dev/null 2>&1; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Start it with: docker-compose up -d mongodb"
    fi
else
    echo "⚠️  MongoDB CLI not found. Install MongoDB or use Docker"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Start MongoDB: docker-compose up -d mongodb"
echo "3. Run development server: pnpm dev"
echo "4. Visit API docs: http://localhost:3000/api-docs"
echo ""
