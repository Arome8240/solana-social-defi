// User types
export interface User {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  role: "user" | "creator" | "admin";
  biometricEnabled: boolean;
  balances: {
    skr: number;
    sol: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Post types
export interface Post {
  id: string;
  userId: string;
  content: string;
  media: string[];
  tokenized: boolean;
  tokenMintAddress?: string;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  likes: Like[];
  replies: Comment[];
  createdAt: Date;
}

export interface Like {
  user: string;
  timestamp: Date;
}

// Token types
export interface Token {
  mintAddress: string;
  ownerId: string;
  metadata: {
    name: string;
    symbol?: string;
    uri?: string;
    description?: string;
    image?: string;
  };
  type: "token" | "nft";
  supply?: number;
  decimals?: number;
}

// Trade types
export interface Trade {
  id: string;
  fromUserId: string;
  toUserId: string;
  tokenMint: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  txSignature?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface AuthResponse {
  message: string;
  token: string;
  user: Omit<User, "createdAt" | "updatedAt">;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}
