import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import Token from "../models/Token";
import User from "../models/User";
import solanaService from "../services/solanaService";
import { logger } from "../utils/logger";

export const mintNFT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { name, symbol, uri, description, image } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user || !user.walletAddress) {
      throw new AppError("User wallet not found", 400, "NO_WALLET");
    }

    const mintAddress = await solanaService.createToken(
      name,
      symbol || "NFT",
      0,
    );

    await solanaService.mintTokens(mintAddress, user.walletAddress, 1);

    const token = await Token.create({
      mintAddress,
      ownerId: req.user.userId,
      metadata: {
        name,
        symbol,
        uri,
        description,
        image,
      },
      type: "nft",
      supply: 1,
      decimals: 0,
    });

    logger.info(`NFT minted: ${mintAddress} by user ${req.user.userId}`);

    res.status(201).json({
      message: "NFT minted successfully",
      nft: token,
    });
  } catch (error) {
    next(error);
  }
};

export const transferNFT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { mintAddress, toWalletAddress } = req.body;

    const token = await Token.findOne({ mintAddress });

    if (!token) {
      throw new AppError("NFT not found", 404, "NFT_NOT_FOUND");
    }

    if (token.ownerId.toString() !== req.user.userId) {
      throw new AppError("You do not own this NFT", 403, "FORBIDDEN");
    }

    const fromUser = await User.findById(req.user.userId);

    if (!fromUser || !fromUser.walletAddress) {
      throw new AppError("User wallet not found", 400, "NO_WALLET");
    }

    const signature = await solanaService.transferTokens(
      mintAddress,
      fromUser.walletAddress,
      toWalletAddress,
      1,
    );

    const toUser = await User.findOne({ walletAddress: toWalletAddress });
    if (toUser) {
      token.ownerId = toUser._id;
      await token.save();
    }

    logger.info(`NFT transferred: ${mintAddress} to ${toWalletAddress}`);

    res.json({
      message: "NFT transferred successfully",
      signature,
    });
  } catch (error) {
    next(error);
  }
};

export const getNFT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { mint } = req.params;

    const token = await Token.findOne({
      mintAddress: mint,
      type: "nft",
    }).populate("ownerId", "username walletAddress");

    if (!token) {
      throw new AppError("NFT not found", 404, "NFT_NOT_FOUND");
    }

    res.json({ nft: token });
  } catch (error) {
    next(error);
  }
};

export const getUserNFTs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const nfts = await Token.find({
      ownerId: req.user.userId,
      type: "nft",
    });

    res.json({ nfts });
  } catch (error) {
    next(error);
  }
};
