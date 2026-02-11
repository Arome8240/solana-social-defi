// Solana constants
export const SOLANA_NETWORKS = {
  MAINNET: "mainnet-beta",
  DEVNET: "devnet",
  TESTNET: "testnet",
} as const;

export const SOLANA_RPC_ENDPOINTS = {
  MAINNET: "https://api.mainnet-beta.solana.com",
  DEVNET: "https://api.devnet.solana.com",
  TESTNET: "https://api.testnet.solana.com",
} as const;

// Token constants
export const TOKEN_DECIMALS = {
  SOL: 9,
  SKR: 9,
  USDC: 6,
} as const;

// API constants
export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    BIOMETRIC: "/api/auth/biometric",
    EXPORT_KEY: "/api/auth/export-private-key",
    WALLET: "/api/auth/wallet",
  },
  SOCIAL: {
    POSTS: "/api/social/posts",
    FEED: "/api/social/feed",
    LIKE: (id: string) => `/api/social/posts/${id}/like`,
    COMMENT: (id: string) => `/api/social/posts/${id}/comment`,
    TOKENIZE: (id: string) => `/api/social/posts/${id}/tokenize`,
  },
  REWARDS: {
    CLAIM: "/api/rewards/claim",
    SUMMARY: "/api/rewards/summary",
  },
  NFTS: {
    MINT: "/api/nfts/mint",
    TRANSFER: "/api/nfts/transfer",
    COLLECTION: "/api/nfts/user/collection",
  },
  TRADE: {
    SWAP: "/api/trade/swap",
    P2P: "/api/trade/p2p",
    HISTORY: "/api/trade/history",
  },
  DEFI: {
    STAKE: "/api/defi/stake",
    LEND: "/api/defi/lend",
    YIELDS: "/api/defi/yields",
  },
  MESSAGES: {
    CHANNELS: "/api/messages/channels",
    SEND: "/api/messages/send",
    TOKEN: "/api/messages/token",
  },
} as const;

// Error codes
export const ERROR_CODES = {
  // Auth errors
  AUTH_NO_TOKEN: "AUTH_NO_TOKEN",
  AUTH_INVALID_TOKEN: "AUTH_INVALID_TOKEN",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  USER_EXISTS: "USER_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_FIELDS: "MISSING_FIELDS",

  // Resource errors
  POST_NOT_FOUND: "POST_NOT_FOUND",
  COMMENT_NOT_FOUND: "COMMENT_NOT_FOUND",
  NFT_NOT_FOUND: "NFT_NOT_FOUND",
  TRADE_NOT_FOUND: "TRADE_NOT_FOUND",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // General errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NO_WALLET: "NO_WALLET",
} as const;

// Reward constants
export const REWARD_RATES = {
  PER_LIKE: 0.1,
  PER_COMMENT: 0.5,
  PER_TOKEN_SALE: 10,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
