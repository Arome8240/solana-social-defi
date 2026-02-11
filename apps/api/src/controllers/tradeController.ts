import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import Trade from "../models/Trade";
import User from "../models/User";
import jupiterService from "../services/jupiterService";
import solanaService from "../services/solanaService";
import { logger } from "../utils/logger";

export const swap = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { inputMint, outputMint, amount } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user || !user.walletAddress) {
      throw new AppError("User wallet not found", 400, "NO_WALLET");
    }

    const swapData = await jupiterService.executeSwap(
      inputMint,
      outputMint,
      amount,
      user.walletAddress,
    );

    logger.info(
      `Swap initiated: ${inputMint} -> ${outputMint} by user ${req.user.userId}`,
    );

    res.json({
      message: "Swap transaction prepared",
      quote: swapData.quote,
      transaction: swapData.transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const createP2PTrade = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { toUserId, tokenMint, amount } = req.body;

    const trade = await Trade.create({
      fromUserId: req.user.userId,
      toUserId,
      tokenMint,
      amount,
      status: "pending",
    });

    logger.info(`P2P trade created: ${trade._id} by user ${req.user.userId}`);

    res.status(201).json({
      message: "P2P trade created",
      trade,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptP2PTrade = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = req.params;

    const trade = await Trade.findById(id);

    if (!trade) {
      throw new AppError("Trade not found", 404, "TRADE_NOT_FOUND");
    }

    if (trade.toUserId.toString() !== req.user.userId) {
      throw new AppError("Unauthorized to accept this trade", 403, "FORBIDDEN");
    }

    if (trade.status !== "pending") {
      throw new AppError("Trade already processed", 400, "TRADE_PROCESSED");
    }

    const fromUser = await User.findById(trade.fromUserId);
    const toUser = await User.findById(trade.toUserId);

    if (!fromUser?.walletAddress || !toUser?.walletAddress) {
      throw new AppError("User wallets not configured", 400, "NO_WALLET");
    }

    const signature = await solanaService.transferTokens(
      trade.tokenMint,
      fromUser.walletAddress,
      toUser.walletAddress,
      trade.amount,
    );

    trade.status = "completed";
    trade.txSignature = signature;
    await trade.save();

    logger.info(`P2P trade completed: ${trade._id}`);

    res.json({
      message: "Trade completed successfully",
      signature,
    });
  } catch (error) {
    next(error);
  }
};

export const getTradeHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const trades = await Trade.find({
      $or: [{ fromUserId: req.user.userId }, { toUserId: req.user.userId }],
    })
      .sort({ createdAt: -1 })
      .populate("fromUserId", "username")
      .populate("toUserId", "username")
      .limit(50);

    res.json({ trades });
  } catch (error) {
    next(error);
  }
};
