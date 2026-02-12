import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import crypto from "crypto";
import User from "../models/User";
import Post from "../models/Post";
import Token from "../models/Token";
import Trade from "../models/Trade";

// Encryption key for private keys (use environment variable in production)
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

async function seedUsers() {
  console.log("🌱 Seeding users...");

  const users = [
    {
      username: "devarome",
      email: "dev@arome.com",
      password: "password123",
      role: "admin" as const,
      balances: { skr: 1000, sol: 10 },
    },
    {
      username: "alice_crypto",
      email: "alice@example.com",
      password: "password123",
      role: "creator" as const,
      balances: { skr: 500, sol: 5 },
    },
    {
      username: "bob_trader",
      email: "bob@example.com",
      password: "password123",
      role: "user" as const,
      balances: { skr: 250, sol: 2.5 },
    },
    {
      username: "charlie_defi",
      email: "charlie@example.com",
      password: "password123",
      role: "user" as const,
      balances: { skr: 750, sol: 7.5 },
    },
    {
      username: "diana_nft",
      email: "diana@example.com",
      password: "password123",
      role: "creator" as const,
      balances: { skr: 600, sol: 6 },
    },
  ];

  const createdUsers: any[] = [];

  for (const userData of users) {
    // Generate Solana wallet
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toString();
    const privateKey = bs58.encode(keypair.secretKey);
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = new User({
      username: userData.username,
      email: userData.email,
      passwordHash,
      walletAddress,
      encryptedPrivateKey,
      role: userData.role,
      balances: userData.balances,
      biometricEnabled: false,
    });

    await user.save();
    createdUsers.push(user);
    console.log(`✅ Created user: ${userData.username} (${walletAddress})`);
  }

  return createdUsers;
}

async function seedTokens(users: any[]) {
  console.log("🌱 Seeding tokens...");

  // Use first user as owner for demo tokens
  const ownerId = users[0]._id;

  const tokens = [
    {
      mintAddress: "So11111111111111111111111111111111111111112",
      ownerId,
      metadata: {
        name: "Solana",
        symbol: "SOL",
        description: "Native Solana token",
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      },
      type: "token" as const,
      decimals: 9,
      supply: 1000000000,
    },
    {
      mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      ownerId,
      metadata: {
        name: "USD Coin",
        symbol: "USDC",
        description: "Stablecoin pegged to USD",
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
      },
      type: "token" as const,
      decimals: 6,
      supply: 1000000000,
    },
    {
      mintAddress: "SKR1111111111111111111111111111111111111111",
      ownerId,
      metadata: {
        name: "Seeker Token",
        symbol: "SKR",
        description: "Platform reward token",
      },
      type: "token" as const,
      decimals: 9,
      supply: 100000000,
    },
  ];

  for (const tokenData of tokens) {
    const token = new Token(tokenData);
    await token.save();
    console.log(`✅ Created token: ${tokenData.metadata.symbol}`);
  }
}

async function seedPosts(users: any[]) {
  console.log("🌱 Seeding posts...");

  const posts = [
    {
      userId: users[0]._id,
      content:
        "Just launched Solana Social! 🚀 Excited to see this community grow. #SolanaSocial #DeFi",
      media: [],
      likes: [],
      comments: [],
      likeCount: 45,
      commentCount: 12,
    },
    {
      userId: users[1]._id,
      content:
        "Made my first trade on Solana Social! The swap feature is so smooth. Love it! 💎",
      media: [],
      likes: [],
      comments: [],
      likeCount: 32,
      commentCount: 8,
    },
    {
      userId: users[2]._id,
      content: "Staking my SOL for that sweet APY. Who else is staking? 📈",
      media: [],
      likes: [],
      comments: [],
      likeCount: 28,
      commentCount: 15,
    },
    {
      userId: users[3]._id,
      content:
        "DeFi on Solana is the future. Fast, cheap, and efficient. #Solana #DeFi",
      media: [],
      likes: [],
      comments: [],
      likeCount: 56,
      commentCount: 20,
    },
    {
      userId: users[4]._id,
      content:
        "Just earned 50 SKR tokens from my posts! The reward system is amazing 🎉",
      media: [],
      likes: [],
      comments: [],
      likeCount: 41,
      commentCount: 9,
    },
    {
      userId: users[1]._id,
      content:
        "Tutorial: How to swap tokens on Solana Social. Check it out! 📚",
      media: [],
      likes: [],
      comments: [],
      likeCount: 67,
      commentCount: 23,
    },
    {
      userId: users[2]._id,
      content: "SOL is pumping! Great time to be in crypto 🌙",
      media: [],
      likes: [],
      comments: [],
      likeCount: 89,
      commentCount: 31,
    },
    {
      userId: users[3]._id,
      content:
        "The wallet feature is so secure and easy to use. Kudos to the team! 🔐",
      media: [],
      likes: [],
      comments: [],
      likeCount: 38,
      commentCount: 11,
    },
  ];

  for (const postData of posts) {
    const post = new Post(postData);
    await post.save();
    console.log(`✅ Created post by user ${postData.userId}`);
  }
}

async function seedTrades(users: unknown[]) {
  console.log("🌱 Seeding trades...");

  const trades = [
    {
      fromUserId: users[0]._id,
      toUserId: users[1]._id,
      tokenMint: "So11111111111111111111111111111111111111112",
      amount: 1.5,
      status: "completed" as const,
      txSignature: "5j7s8K9mN2pQ3rT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3m",
    },
    {
      fromUserId: users[1]._id,
      toUserId: users[2]._id,
      tokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: 500,
      status: "completed" as const,
      txSignature: "4n5o6P7qR8sT9uV0wX1yZ2aB3cD4eF5gH6iJ7kL8mN9o",
    },
    {
      fromUserId: users[2]._id,
      toUserId: users[3]._id,
      tokenMint: "So11111111111111111111111111111111111111112",
      amount: 5,
      status: "completed" as const,
      txSignature: "3p4q5R6sT7uV8wX9yZ0aB1cD2eF3gH4iJ5kL6mN7oP8q",
    },
    {
      fromUserId: users[3]._id,
      toUserId: users[0]._id,
      tokenMint: "SKR1111111111111111111111111111111111111111",
      amount: 1160,
      status: "completed" as const,
      txSignature: "2r3s4T5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4mN5oP6qR7s",
    },
    {
      fromUserId: users[1]._id,
      toUserId: users[4]._id,
      tokenMint: "So11111111111111111111111111111111111111112",
      amount: 2,
      status: "pending" as const,
      txSignature: "1t2u3V4wX5yZ6aB7cD8eF9gH0iJ1kL2mN3oP4qR5sT6u",
    },
  ];

  for (const tradeData of trades) {
    const trade = new Trade(tradeData);
    await trade.save();
    console.log(
      `✅ Created trade: ${tradeData.amount} tokens from user ${tradeData.fromUserId} to ${tradeData.toUserId}`,
    );
  }
}

async function main() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/solana-social-defi";
    await mongoose.connect(mongoUri);
    console.log("📦 Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Token.deleteMany({});
    await Trade.deleteMany({});
    console.log("✅ Cleared existing data");

    // Seed data
    const users = await seedUsers();
    await seedTokens(users);
    await seedPosts(users);
    await seedTrades(users);

    console.log("\n✨ Seed data created successfully!");
    console.log("\n📝 Test Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email: dev@arome.com");
    console.log("Password: password123");
    console.log("Role: Admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email: alice@example.com");
    console.log("Password: password123");
    console.log("Role: Creator");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email: bob@example.com");
    console.log("Password: password123");
    console.log("Role: User");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
