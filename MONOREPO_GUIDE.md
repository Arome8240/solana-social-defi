# Monorepo Guide

## Overview

This is a pnpm-based monorepo for the Solana Social DeFi platform, containing the backend API and mobile app.

## Structure

```
solana-social-defi-monorepo/
├── apps/
│   ├── api/                    # Backend API (Node.js + Express)
│   └── mobile-app/             # Mobile app (React Native)
├── packages/
│   └── shared/                 # Shared types, constants, and utilities
├── docs/                       # Documentation
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Main documentation
```

## Prerequisites

- Node.js v20+
- pnpm v8+
- MongoDB (for API)
- Solana CLI (optional, for blockchain operations)

## Installation

### 1. Install pnpm globally

```bash
npm install -g pnpm
```

### 2. Install all dependencies

```bash
pnpm install
```

This will install dependencies for all workspaces (root, apps, and packages).

## Development

### Run all apps in development mode

```bash
pnpm dev
```

This runs both the API and mobile app in parallel.

### Run specific app

```bash
# API only
pnpm dev:api

# Mobile app only
pnpm dev:mobile
```

### Run shared package in watch mode

```bash
cd packages/shared
pnpm dev
```

## Building

### Build all apps

```bash
pnpm build
```

### Build specific app

```bash
pnpm build:api
pnpm build:mobile
```

## Testing

### Run all tests

```bash
pnpm test
```

### Run tests for specific app

```bash
pnpm test:api
pnpm test:mobile
```

## Linting

```bash
pnpm lint
```

## Package Management

### Add dependency to specific workspace

```bash
# Add to API
pnpm --filter @solana-social/api add express

# Add to mobile app
pnpm --filter @solana-social/mobile-app add react-native

# Add to shared package
pnpm --filter @solana-social/shared add lodash
```

### Add dev dependency

```bash
pnpm --filter @solana-social/api add -D typescript
```

### Add dependency to root

```bash
pnpm add -w <package-name>
```

### Remove dependency

```bash
pnpm --filter @solana-social/api remove <package-name>
```

## Using Shared Package

The `@solana-social/shared` package contains common types, constants, and utilities.

### In API (apps/api)

1. Add to package.json:

```json
{
  "dependencies": {
    "@solana-social/shared": "workspace:*"
  }
}
```

2. Import in code:

```typescript
import { User, API_ROUTES, formatSolAmount } from "@solana-social/shared";
```

### In Mobile App (apps/mobile-app)

Same as API - add to dependencies and import.

## Workspace Commands

### List all workspaces

```bash
pnpm list -r --depth -1
```

### Run command in all workspaces

```bash
pnpm -r <command>
```

### Run command in specific workspace

```bash
pnpm --filter <workspace-name> <command>
```

### Run command in parallel

```bash
pnpm --parallel <command>
```

## Environment Variables

Each app has its own `.env` file:

- `apps/api/.env` - API environment variables
- `apps/mobile-app/.env` - Mobile app environment variables

Copy `.env.example` to `.env` in each app directory and configure.

## Docker

### Build API Docker image

```bash
cd apps/api
docker build -t solana-social-api .
```

### Run with docker-compose

```bash
cd apps/api
docker-compose up
```

## Troubleshooting

### Clear all node_modules

```bash
pnpm clean
pnpm install
```

### Clear pnpm store

```bash
pnpm store prune
```

### Rebuild shared package

```bash
cd packages/shared
pnpm build
```

### Check for circular dependencies

```bash
pnpm list --depth=Infinity
```

## Best Practices

### 1. Shared Code

Put common code in `packages/shared`:

- Types and interfaces
- Constants and enums
- Utility functions
- Validation schemas

### 2. Versioning

Use `workspace:*` for internal dependencies:

```json
{
  "dependencies": {
    "@solana-social/shared": "workspace:*"
  }
}
```

### 3. Scripts

Define scripts in root `package.json` for common tasks:

```json
{
  "scripts": {
    "dev": "pnpm --parallel dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  }
}
```

### 4. Git Workflow

- Commit changes from root directory
- Use conventional commits
- Run tests before committing
- Keep lock file in version control

### 5. Dependencies

- Use exact versions for production dependencies
- Use `^` for dev dependencies
- Regularly update dependencies
- Audit for security vulnerabilities

## CI/CD

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
```

## Deployment

### API Deployment

```bash
cd apps/api
pnpm build
pnpm start
```

### Mobile App Deployment

Follow React Native deployment guides for iOS and Android.

## Useful Commands

```bash
# Check workspace structure
pnpm list -r --depth 0

# Update all dependencies
pnpm update -r

# Check for outdated packages
pnpm outdated -r

# Run security audit
pnpm audit

# Fix security issues
pnpm audit --fix

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild everything
pnpm clean
pnpm install
pnpm build
```

## Adding New Workspace

### 1. Create directory

```bash
mkdir -p apps/new-app
# or
mkdir -p packages/new-package
```

### 2. Initialize package.json

```bash
cd apps/new-app
pnpm init
```

### 3. Update package name

```json
{
  "name": "@solana-social/new-app",
  "version": "1.0.0"
}
```

### 4. Install from root

```bash
cd ../..
pnpm install
```

## Performance Tips

### 1. Use filters

```bash
# Only build what changed
pnpm --filter @solana-social/api build
```

### 2. Parallel execution

```bash
# Run tests in parallel
pnpm --parallel test
```

### 3. Selective installation

```bash
# Install only production dependencies
pnpm install --prod
```

### 4. Cache

pnpm uses a content-addressable store, so packages are cached globally.

## Debugging

### Check dependency tree

```bash
pnpm why <package-name>
```

### Check workspace info

```bash
pnpm list -r --depth 0 --json
```

### Verify workspace links

```bash
ls -la node_modules/@solana-social
```

## Migration from npm/yarn

### 1. Remove old lock files

```bash
rm package-lock.json yarn.lock
```

### 2. Install with pnpm

```bash
pnpm install
```

### 3. Update scripts

Replace `npm run` or `yarn` with `pnpm` in scripts.

## Resources

- [pnpm Documentation](https://pnpm.io/)
- [Workspace Guide](https://pnpm.io/workspaces)
- [pnpm CLI](https://pnpm.io/cli/add)

## Support

For issues or questions:

1. Check this guide
2. Check pnpm documentation
3. Open an issue in the repository
