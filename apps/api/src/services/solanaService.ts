import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";
import bs58 from "bs58";
import { logger } from "../utils/logger";

class SolanaService {
  private connection: Connection;
  private feePayerKeypair: Keypair | null = null;
  private skrMintAuthority: Keypair | null = null;
  private skrMintAddress: PublicKey | null = null;

  constructor() {
    const rpcUrl =
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
    this.connection = new Connection(rpcUrl, "confirmed");
    this.initializeKeypairs();
  }

  private initializeKeypairs(): void {
    try {
      if (process.env.FEE_PAYER_PRIVATE_KEY) {
        const feePayerSecret = bs58.decode(process.env.FEE_PAYER_PRIVATE_KEY);
        this.feePayerKeypair = Keypair.fromSecretKey(feePayerSecret);
        logger.info("Fee payer initialized");
      }

      if (process.env.SKR_MINT_AUTHORITY_PRIVATE_KEY) {
        const mintAuthoritySecret = bs58.decode(
          process.env.SKR_MINT_AUTHORITY_PRIVATE_KEY,
        );
        this.skrMintAuthority = Keypair.fromSecretKey(mintAuthoritySecret);
        logger.info("SKR mint authority initialized");
      }

      if (process.env.SKR_TOKEN_MINT) {
        this.skrMintAddress = new PublicKey(process.env.SKR_TOKEN_MINT);
      }
    } catch (error) {
      logger.error("Failed to initialize keypairs:", error);
    }
  }

  async createToken(
    _name: string,
    _symbol: string,
    decimals: number = 9,
  ): Promise<string> {
    if (!this.feePayerKeypair) {
      throw new Error("Fee payer not configured");
    }

    const mintKeypair = Keypair.generate();

    const mint = await createMint(
      this.connection,
      this.feePayerKeypair,
      this.feePayerKeypair.publicKey,
      null,
      decimals,
      mintKeypair,
    );

    logger.info(`Token created: ${mint.toBase58()}`);
    return mint.toBase58();
  }

  async mintTokens(
    mintAddress: string,
    destinationWallet: string,
    amount: number,
  ): Promise<string> {
    if (!this.feePayerKeypair) {
      throw new Error("Fee payer not configured");
    }

    const mint = new PublicKey(mintAddress);
    const destination = new PublicKey(destinationWallet);

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.feePayerKeypair,
      mint,
      destination,
    );

    const signature = await mintTo(
      this.connection,
      this.feePayerKeypair,
      mint,
      tokenAccount.address,
      this.feePayerKeypair,
      amount,
    );

    logger.info(
      `Minted ${amount} tokens to ${destinationWallet}, signature: ${signature}`,
    );
    return signature;
  }

  async transferTokens(
    mintAddress: string,
    fromWallet: string,
    toWallet: string,
    amount: number,
  ): Promise<string> {
    if (!this.feePayerKeypair) {
      throw new Error("Fee payer not configured");
    }

    const mint = new PublicKey(mintAddress);
    const from = new PublicKey(fromWallet);
    const to = new PublicKey(toWallet);

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.feePayerKeypair,
      mint,
      from,
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.feePayerKeypair,
      mint,
      to,
    );

    const signature = await transfer(
      this.connection,
      this.feePayerKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      from,
      amount,
    );

    logger.info(
      `Transferred ${amount} tokens from ${fromWallet} to ${toWallet}`,
    );
    return signature;
  }

  async rewardSKR(walletAddress: string, amount: number): Promise<string> {
    if (!this.skrMintAddress || !this.skrMintAuthority) {
      throw new Error("SKR token not configured");
    }

    const destination = new PublicKey(walletAddress);

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.skrMintAuthority,
      this.skrMintAddress,
      destination,
    );

    const signature = await mintTo(
      this.connection,
      this.skrMintAuthority,
      this.skrMintAddress,
      tokenAccount.address,
      this.skrMintAuthority,
      amount * Math.pow(10, 9), // Assuming 9 decimals
    );

    logger.info(`Rewarded ${amount} SKR to ${walletAddress}`);
    return signature;
  }

  async executeGaslessTransaction(
    serializedTransaction: string,
  ): Promise<string> {
    if (!this.feePayerKeypair) {
      throw new Error("Fee payer not configured");
    }

    const transaction = Transaction.from(
      Buffer.from(serializedTransaction, "base64"),
    );
    transaction.feePayer = this.feePayerKeypair.publicKey;

    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    transaction.partialSign(this.feePayerKeypair);

    const signature = await this.connection.sendRawTransaction(
      transaction.serialize(),
    );
    await this.connection.confirmTransaction(signature);

    logger.info(`Gasless transaction executed: ${signature}`);
    return signature;
  }

  async getBalance(walletAddress: string): Promise<number> {
    const publicKey = new PublicKey(walletAddress);
    const balance = await this.connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  getConnection(): Connection {
    return this.connection;
  }
}

export default new SolanaService();
