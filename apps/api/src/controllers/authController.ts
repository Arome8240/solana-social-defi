import { Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User";
import OTP from "../models/OTP";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import walletService from "../services/walletService";
import emailService from "../services/emailService";
import { logger } from "../utils/logger";

const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || "default-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as SignOptions,
  );
};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Check if user details are available (username check)
export const checkUsername = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.body;

    if (!username) {
      throw new AppError("Username is required", 400, "USERNAME_REQUIRED");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new AppError("Username already taken", 400, "USERNAME_TAKEN");
    }

    res.json({
      message: "Username available",
      available: true,
    });
  } catch (error) {
    next(error);
  }
};

// Step 2: Send OTP to email for signup
export const signupSendOTP = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { fullName, username, email } = req.body;

    if (!email || !username || !fullName) {
      throw new AppError(
        "Full name, username, and email are required",
        400,
        "MISSING_FIELDS",
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError(
        "User with this email or username already exists",
        400,
        "USER_EXISTS",
      );
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    await OTP.create({
      email,
      code,
      expiresAt,
    });

    // Send OTP via email
    await emailService.sendOTP(email, code);

    logger.info(`OTP sent to ${email} for signup`);

    res.json({
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    next(error);
  }
};

// Step 3: Verify OTP and complete signup
export const signupVerifyOTP = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { fullName, username, bio, email, code } = req.body;

    if (!email || !code || !username || !fullName) {
      throw new AppError(
        "Email, code, username, and full name are required",
        400,
        "MISSING_FIELDS",
      );
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ email, verified: false });

    if (!otpRecord) {
      throw new AppError("OTP not found or already used", 400, "OTP_NOT_FOUND");
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      throw new AppError("OTP has expired", 400, "OTP_EXPIRED");
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      throw new AppError(
        "Too many failed attempts. Please request a new OTP",
        400,
        "TOO_MANY_ATTEMPTS",
      );
    }

    // Verify code
    if (otpRecord.code !== code) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new AppError(
        `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining`,
        400,
        "INVALID_OTP",
      );
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate Solana wallet for the user (custodial)
    const wallet = walletService.generateWallet();
    const encryptedPrivateKey = walletService.encryptPrivateKey(
      wallet.privateKey,
    );

    // Create user
    const user = await User.create({
      fullName,
      username,
      bio: bio || "",
      email,
      walletAddress: wallet.publicKey,
      encryptedPrivateKey,
      emailVerified: true,
      role: "user",
      balances: {
        skr: 100, // Welcome bonus
        sol: 0.1, // Small SOL for gas fees
      },
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.role);

    // Send welcome email
    await emailService.sendWelcomeEmail(email, username);

    // Delete the OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    logger.info(`User signed up: ${email} with wallet ${wallet.publicKey}`);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        role: user.role,
        walletAddress: user.walletAddress,
        emailVerified: user.emailVerified,
        biometricEnabled: user.biometricEnabled,
        balances: user.balances,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login: Send OTP to email
export const loginSendOTP = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400, "EMAIL_REQUIRED");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(
        "No account found with this email",
        404,
        "USER_NOT_FOUND",
      );
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    await OTP.create({
      email,
      code,
      expiresAt,
    });

    // Send OTP via email
    await emailService.sendOTP(email, code);

    logger.info(`OTP sent to ${email} for login`);

    res.json({
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    next(error);
  }
};

// Login: Verify OTP
export const loginVerifyOTP = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      throw new AppError("Email and code are required", 400, "MISSING_FIELDS");
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ email, verified: false });

    if (!otpRecord) {
      throw new AppError("OTP not found or already used", 400, "OTP_NOT_FOUND");
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      throw new AppError("OTP has expired", 400, "OTP_EXPIRED");
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      throw new AppError(
        "Too many failed attempts. Please request a new OTP",
        400,
        "TOO_MANY_ATTEMPTS",
      );
    }

    // Verify code
    if (otpRecord.code !== code) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new AppError(
        `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining`,
        400,
        "INVALID_OTP",
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Mark OTP as verified and delete
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.role);

    logger.info(`User logged in: ${email}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        role: user.role,
        walletAddress: user.walletAddress,
        emailVerified: user.emailVerified,
        biometricEnabled: user.biometricEnabled,
        balances: user.balances,
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

    const { code } = req.body;

    if (!code) {
      throw new AppError("OTP code required", 400, "CODE_REQUIRED");
    }

    // Verify OTP for security
    const otpRecord = await OTP.findOne({
      email: req.user.email,
      verified: false,
    });

    if (!otpRecord || otpRecord.code !== code) {
      throw new AppError("Invalid or expired OTP", 401, "INVALID_OTP");
    }

    // Get user with encrypted private key
    const user = await User.findById(req.user.userId).select(
      "+encryptedPrivateKey",
    );

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Export private key as base58
    const privateKey = walletService.exportPrivateKey(user.encryptedPrivateKey);

    // Delete the OTP
    await OTP.deleteOne({ _id: otpRecord._id });

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
