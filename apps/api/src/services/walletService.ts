import { Keypair } from "@solana/web3.js";
import crypto from "crypto";
import bs58 from "bs58";
//import { logger } from "../utils/logger";

class WalletService {
  private encryptionKey: Buffer;

  constructor() {
    // Use a strong encryption key from environment
    const key =
      process.env.WALLET_ENCRYPTION_KEY || "default-key-change-in-production";
    this.encryptionKey = crypto.scryptSync(key, "salt", 32);
  }

  /**
   * Generate a new Solana keypair for a user
   */
  generateWallet(): { publicKey: string; privateKey: Uint8Array } {
    const keypair = Keypair.generate();
    return {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: keypair.secretKey,
    };
  }

  /**
   * Encrypt a private key using AES-256-GCM
   */
  encryptPrivateKey(privateKey: Uint8Array): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", this.encryptionKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(privateKey)),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    // Combine iv + authTag + encrypted data
    const combined = Buffer.concat([iv, authTag, encrypted]);
    return combined.toString("base64");
  }

  /**
   * Decrypt a private key
   */
  decryptPrivateKey(encryptedData: string): Uint8Array {
    const combined = Buffer.from(encryptedData, "base64");

    const iv = combined.subarray(0, 16);
    const authTag = combined.subarray(16, 32);
    const encrypted = combined.subarray(32);

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      this.encryptionKey,
      iv,
    );
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return new Uint8Array(decrypted);
  }

  /**
   * Get a Keypair from encrypted private key
   */
  getKeypairFromEncrypted(encryptedPrivateKey: string): Keypair {
    const privateKey = this.decryptPrivateKey(encryptedPrivateKey);
    return Keypair.fromSecretKey(privateKey);
  }

  /**
   * Export private key as base58 (for user backup)
   */
  exportPrivateKey(encryptedPrivateKey: string): string {
    const privateKey = this.decryptPrivateKey(encryptedPrivateKey);
    return bs58.encode(privateKey);
  }

  /**
   * Validate a Solana address
   */
  isValidAddress(address: string): boolean {
    try {
      const decoded = bs58.decode(address);
      return decoded.length === 32;
    } catch {
      return false;
    }
  }
}

export default new WalletService();
