import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import MiniApp from "../models/MiniApp";
import { logger } from "../utils/logger";

export const createMiniApp = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { name, embedUrl, codeSnippet, description } = req.body;

    const miniApp = await MiniApp.create({
      name,
      creatorId: req.user.userId,
      embedUrl,
      codeSnippet,
      description,
      active: true,
    });

    logger.info(`Mini app created: ${miniApp._id} by user ${req.user.userId}`);

    res.status(201).json({
      message: "Mini app created successfully",
      miniApp,
    });
  } catch (error) {
    next(error);
  }
};

export const getMiniApp = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const miniApp = await MiniApp.findById(id).populate(
      "creatorId",
      "username",
    );

    if (!miniApp) {
      throw new AppError("Mini app not found", 404, "MINIAPP_NOT_FOUND");
    }

    if (!miniApp.active) {
      throw new AppError("Mini app is inactive", 403, "MINIAPP_INACTIVE");
    }

    res.json({ miniApp });
  } catch (error) {
    next(error);
  }
};

export const updateMiniApp = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = req.params;
    const { name, embedUrl, codeSnippet, description, active } = req.body;

    const miniApp = await MiniApp.findById(id);

    if (!miniApp) {
      throw new AppError("Mini app not found", 404, "MINIAPP_NOT_FOUND");
    }

    if (miniApp.creatorId.toString() !== req.user.userId) {
      throw new AppError(
        "Unauthorized to update this mini app",
        403,
        "FORBIDDEN",
      );
    }

    if (name) miniApp.name = name;
    if (embedUrl !== undefined) miniApp.embedUrl = embedUrl;
    if (codeSnippet !== undefined) miniApp.codeSnippet = codeSnippet;
    if (description !== undefined) miniApp.description = description;
    if (active !== undefined) miniApp.active = active;

    await miniApp.save();

    logger.info(`Mini app updated: ${miniApp._id}`);

    res.json({
      message: "Mini app updated successfully",
      miniApp,
    });
  } catch (error) {
    next(error);
  }
};

export const listMiniApps = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const miniApps = await MiniApp.find({ active: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("creatorId", "username");

    const total = await MiniApp.countDocuments({ active: true });

    res.json({
      miniApps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
