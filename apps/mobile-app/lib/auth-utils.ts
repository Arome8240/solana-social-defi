/**
 * Authentication utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validate username
 */
export const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

/**
 * Get password strength level
 */
export const getPasswordStrength = (
  password: string,
): "weak" | "medium" | "strong" => {
  if (password.length < 8) return "weak";

  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength >= 4) return "strong";
  if (strength >= 2) return "medium";
  return "weak";
};

/**
 * Format wallet address for display
 */
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Validate form data for signup
 */
export const validateSignupForm = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): { valid: boolean; error?: string } => {
  if (
    !data.username ||
    !data.email ||
    !data.password ||
    !data.confirmPassword
  ) {
    return { valid: false, error: "All fields are required" };
  }

  if (!isValidUsername(data.username)) {
    return {
      valid: false,
      error:
        "Username must be at least 3 characters and contain only letters, numbers, and underscores",
    };
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (!isValidPassword(data.password)) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (data.password !== data.confirmPassword) {
    return { valid: false, error: "Passwords do not match" };
  }

  return { valid: true };
};

/**
 * Validate form data for login
 */
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): { valid: boolean; error?: string } => {
  if (!data.email || !data.password) {
    return { valid: false, error: "Email and password are required" };
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
};
