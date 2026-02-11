import { Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import walletService from "../services/walletService";
import { logger } from "../utils/logger";

const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || "default-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as SignOptions,
  );
};

export const signup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!password) {
      throw new AppError("Password is required", 400, "PASSWORD_REQUIRED");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError("User already exists", 400, "USER_EXISTS");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate Solana wallet for the user (custodial)
    const wallet = walletService.generateWallet();
    const encryptedPrivateKey = walletService.encryptPrivateKey(
      wallet.privateKey,
    );

    // Create user with auto-generated wallet
    const user = await User.create({
      username,
      email,
      passwordHash,
      walletAddress: wallet.publicKey,
      encryptedPrivateKey,
      role: "user",
    });

    const token = generateToken(user._id.toString(), user.email, user.role);

    logger.info(`User signed up: ${email} with wallet ${wallet.publicKey}`);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        biometricEnabled: user.biometricEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    logger.info(`User logged in: ${email}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        biometricEnabled: user.biometricEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBiometric = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { biometricEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { biometricEnabled },
      { new: true },
    );

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    logger.info(
      `Biometric ${biometricEnabled ? "enabled" : "disabled"} for user ${user.email}`,
    );

    res.json({
      message: "Biometric setting updated",
      biometricEnabled: user.biometricEnabled,
    });
  } catch (error) {
    next(error);
  }
};

export const exportPrivateKey = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { password } = req.body;

    if (!password) {
      throw new AppError("Password required", 400, "PASSWORD_REQUIRED");
    }

    // Get user with encrypted private key
    const user = await User.findById(req.user.userId).select(
      "+encryptedPrivateKey",
    );

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Verify password before exporting
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid password", 401, "INVALID_PASSWORD");
    }

    // Export private key as base58
    const privateKey = walletService.exportPrivateKey(user.encryptedPrivateKey);

    logger.info(`Private key exported for user ${user.email}`);

    res.json({
      message: "Private key exported successfully",
      privateKey,
      warning: "Keep this private key secure. Never share it with anyone.",
    });
  } catch (error) {
    next(error);
  }
};

export const getWalletInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    res.json({
      walletAddress: user.walletAddress,
      balances: user.balances,
    });
  } catch (error) {
    next(error);
  }
};
