/**
 * Quick Seed Script - Creates a single test account
 * Run with: npm run seed:quick
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import crypto from "crypto";
import User from "../models/User";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-32-character-secret-key-here";

function encryptPrivateKey(privateKey: string): string {
  // Use createCipheriv instead of deprecated createCipher
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Prepend IV to encrypted data
  return iv.toString("hex") + ":" + encrypted;
}

async function createTestAccount() {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/solana-social-defi";
    await mongoose.connect(mongoUri);
    console.log("📦 Connected to MongoDB");

    // Check if user already exists
    const existing = await User.findOne({ email: "test@example.com" });
    if (existing) {
      console.log("✅ Test account already exists!");
      console.log("\n📝 Login Credentials:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Email: test@example.com");
      console.log("Password: password123");
      console.log("Username: testuser");
      console.log("Wallet:", existing.walletAddress);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Generate Solana wallet
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toString();
    const privateKey = bs58.encode(keypair.secretKey);
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Hash password
    const passwordHash = await bcrypt.hash("password123", 10);

    // Create user
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      passwordHash,
      walletAddress,
      encryptedPrivateKey,
      role: "user",
      balances: {
        skr: 100,
        sol: 1,
      },
      biometricEnabled: false,
    });

    await user.save();

    console.log("✅ Test account created successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email: test@example.com");
    console.log("Password: password123");
    console.log("Username: testuser");
    console.log("Wallet:", walletAddress);
    console.log("SKR Balance: 100");
    console.log("SOL Balance: 1");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test account:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createTestAccount();
