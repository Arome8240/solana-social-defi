import { StreamChat } from "stream-chat";
import { logger } from "../utils/logger";

class GetStreamService {
  private client: StreamChat | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      const apiKey = process.env.GETSTREAM_API_KEY;
      const apiSecret = process.env.GETSTREAM_API_SECRET;

      if (!apiKey || !apiSecret) {
        logger.warn("GetStream credentials not configured");
        return;
      }

      this.client = StreamChat.getInstance(apiKey, apiSecret);
      logger.info("GetStream client initialized");
    } catch (error) {
      logger.error("Failed to initialize GetStream:", error);
    }
  }

  async createUserToken(userId: string): Promise<string> {
    if (!this.client) {
      throw new Error("GetStream not configured");
    }

    const token = this.client.createToken(userId);
    return token;
  }

  async createChannel(
    type: string,
    channelId: string,
    creatorId: string,
    members: string[],
    name?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (!this.client) {
      throw new Error("GetStream not configured");
    }

    const channel = this.client.channel(type, channelId, {
      created_by_id: creatorId,
      members,
      name,
    });

    await channel.create();
    logger.info(`Channel created: ${channelId}`);
    return channel;
  }

  async sendMessage(
    channelType: string,
    channelId: string,
    userId: string,
    text: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (!this.client) {
      throw new Error("GetStream not configured");
    }

    const channel = this.client.channel(channelType, channelId);
    const message = await channel.sendMessage({
      text,
      user_id: userId,
    });

    logger.info(`Message sent to channel ${channelId}`);
    return message;
  }

  async getChannelMessages(
    channelType: string,
    channelId: string,
    limit: number = 50,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (!this.client) {
      throw new Error("GetStream not configured");
    }

    const channel = this.client.channel(channelType, channelId);
    const state = await channel.query({
      messages: { limit },
    });

    return state.messages;
  }

  getClient(): StreamChat | null {
    return this.client;
  }
}

export default new GetStreamService();
