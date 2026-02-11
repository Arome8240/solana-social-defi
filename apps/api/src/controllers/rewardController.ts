import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import User from "../models/User";
import Post from "../models/Post";
import solanaService from "../services/solanaService";
import { logger } from "../utils/logger";

export const claimRewards = async (
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

    if (user.role !== "creator") {
      throw new AppError("Only creators can claim rewards", 403, "FORBIDDEN");
    }

    if (!user.walletAddress) {
      throw new AppError("Wallet address not set", 400, "NO_WALLET");
    }

    const posts = await Post.find({ userId: user._id });

    const skrPerLike = parseFloat(process.env.SKR_PER_LIKE || "0.1");
    const skrPerComment = parseFloat(process.env.SKR_PER_COMMENT || "0.5");

    let totalReward = 0;

    for (const post of posts) {
      totalReward += post.likeCount * skrPerLike;
      totalReward += post.commentCount * skrPerComment;
    }

    if (totalReward === 0) {
      throw new AppError("No rewards to claim", 400, "NO_REWARDS");
    }

    const signature = await solanaService.rewardSKR(
      user.walletAddress,
      totalReward,
    );

    user.balances.skr += totalReward;
    await user.save();

    logger.info(`Rewards claimed: ${totalReward} SKR by user ${user.username}`);

    res.json({
      message: "Rewards claimed successfully",
      amount: totalReward,
      signature,
      newBalance: user.balances.skr,
    });
  } catch (error) {
    next(error);
  }
};

export const getRewardsSummary = async (
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

    const posts = await Post.find({ userId: user._id });

    const skrPerLike = parseFloat(process.env.SKR_PER_LIKE || "0.1");
    const skrPerComment = parseFloat(process.env.SKR_PER_COMMENT || "0.5");

    let pendingRewards = 0;
    let totalLikes = 0;
    let totalComments = 0;

    for (const post of posts) {
      totalLikes += post.likeCount;
      totalComments += post.commentCount;
      pendingRewards += post.likeCount * skrPerLike;
      pendingRewards += post.commentCount * skrPerComment;
    }

    res.json({
      currentBalance: user.balances.skr,
      pendingRewards,
      totalLikes,
      totalComments,
      totalPosts: posts.length,
    });
  } catch (error) {
    next(error);
  }
};
