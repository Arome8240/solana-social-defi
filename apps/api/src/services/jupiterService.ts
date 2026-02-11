import axios from "axios";
import { logger } from "../utils/logger";

class JupiterService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.JUPITER_API_URL || "https://quote-api.jup.ag/v6";
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50,
  ): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount,
          slippageBps,
        },
      });

      logger.info(`Jupiter quote fetched for ${inputMint} -> ${outputMint}`);
      return response.data;
    } catch (error) {
      logger.error("Failed to get Jupiter quote:", error);
      throw new Error("Failed to fetch swap quote");
    }
  }

  async getSwapTransaction(
    quoteResponse: any,
    userPublicKey: string,
  ): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/swap`, {
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true,
      });

      logger.info("Jupiter swap transaction created");
      return response.data;
    } catch (error) {
      logger.error("Failed to create swap transaction:", error);
      throw new Error("Failed to create swap transaction");
    }
  }

  async executeSwap(
    inputMint: string,
    outputMint: string,
    amount: number,
    userPublicKey: string,
  ): Promise<any> {
    const quote = await this.getQuote(inputMint, outputMint, amount);
    const swapTransaction = await this.getSwapTransaction(quote, userPublicKey);

    return {
      quote,
      transaction: swapTransaction.swapTransaction,
    };
  }
}

export default new JupiterService();
