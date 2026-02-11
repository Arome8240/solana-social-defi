import cron from "node-cron";
import User from "../models/User";
import Post from "../models/Post";
import solanaService from "./solanaService";
import { logger } from "../utils/logger";

export const startCronJobs = (): void => {
  const cronSchedule = process.env.DAILY_REWARD_CRON || "0 0 * * *";

  cron.schedule(cronSchedule, async () => {
    logger.info("Starting daily SKR rewards distribution");
    await distributeCreatorRewards();
  });

  logger.info(`Cron job scheduled: ${cronSchedule}`);
};

const distributeCreatorRewards = async (): Promise<void> => {
  try {
    const creators = await User.find({ role: "creator" });

    const skrPerLike = parseFloat(process.env.SKR_PER_LIKE || "0.1");
    const skrPerComment = parseFloat(process.env.SKR_PER_COMMENT || "0.5");

    for (const creator of creators) {
      const posts = await Post.find({ userId: creator._id });

      let totalReward = 0;

      for (const post of posts) {
        totalReward += post.likeCount * skrPerLike;
        totalReward += post.commentCount * skrPerComment;
      }

      if (totalReward > 0 && creator.walletAddress) {
        try {
          await solanaService.rewardSKR(creator.walletAddress, totalReward);

          creator.balances.skr += totalReward;
          await creator.save();

          logger.info(
            `Rewarded ${totalReward} SKR to creator ${creator.username}`,
          );
        } catch (error) {
          logger.error(`Failed to reward creator ${creator.username}:`, error);
        }
      }
    }

    logger.info("Daily SKR rewards distribution completed");
  } catch (error) {
    logger.error("Failed to distribute creator rewards:", error);
  }
};
