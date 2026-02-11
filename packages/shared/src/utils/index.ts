// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidSolanaAddress = (address: string): boolean => {
  // Solana addresses are base58 encoded and 32-44 characters
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaAddressRegex.test(address);
};

// Formatting utilities
export const formatSolAmount = (lamports: number): string => {
  return (lamports / 1_000_000_000).toFixed(4);
};

export const formatTokenAmount = (amount: number, decimals: number): string => {
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
};

export const truncateAddress = (address: string, chars: number = 4): string => {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Date utilities
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Error utilities
export const createErrorResponse = (message: string, code: string) => {
  return {
    success: false,
    error: message,
    code,
  };
};

export const createSuccessResponse = <T>(data: T) => {
  return {
    success: true,
    data,
  };
};

// Pagination utilities
export const calculatePagination = (
  total: number,
  page: number,
  limit: number,
) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  };
};
