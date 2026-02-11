import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import getstreamService from "../services/getstreamService";
import { logger } from "../utils/logger";

export const createChannel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { type, channelId, members, name } = req.body;

    const channel = await getstreamService.createChannel(
      type || "messaging",
      channelId,
      req.user.userId,
      members,
      name,
    );

    logger.info(`Channel created: ${channelId} by user ${req.user.userId}`);

    res.status(201).json({
      message: "Channel created successfully",
      channel,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { channelType, channelId, text } = req.body;

    const message = await getstreamService.sendMessage(
      channelType || "messaging",
      channelId,
      req.user.userId,
      text,
    );

    logger.info(
      `Message sent to channel ${channelId} by user ${req.user.userId}`,
    );

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getChannelMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await getstreamService.getChannelMessages(
      "messaging",
      id,
      limit,
    );

    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const token = await getstreamService.createUserToken(req.user.userId);

    res.json({
      token,
      userId: req.user.userId,
    });
  } catch (error) {
    next(error);
  }
};
