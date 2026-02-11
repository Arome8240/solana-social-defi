import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import solanaService from "../services/solanaService";
import { logger } from "../utils/logger";

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { content, media } = req.body;

    const post = await Post.create({
      userId: req.user.userId,
      content,
      media: media || [],
    });

    logger.info(`Post created by user ${req.user.userId}`);

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("userId", "username walletAddress")
      .populate("comments.author", "username");

    if (!post) {
      throw new AppError("Post not found", 404, "POST_NOT_FOUND");
    }

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      throw new AppError("Post not found", 404, "POST_NOT_FOUND");
    }

    const existingLikeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user!.userId,
    );

    if (existingLikeIndex > -1) {
      post.likes.splice(existingLikeIndex, 1);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      post.likes.push({
        user: new mongoose.Types.ObjectId(req.user.userId),
        timestamp: new Date(),
      });
      post.likeCount += 1;
    }

    await post.save();

    logger.info(`Post ${id} liked/unliked by user ${req.user.userId}`);

    res.json({
      message: "Post like toggled",
      likeCount: post.likeCount,
      liked: existingLikeIndex === -1,
    });
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      throw new AppError("Post not found", 404, "POST_NOT_FOUND");
    }

    post.comments.push({
      text,
      author: new mongoose.Types.ObjectId(req.user.userId),
      likes: [],
      replies: [],
      createdAt: new Date(),
    });

    post.commentCount += 1;
    await post.save();

    logger.info(`Comment added to post ${id} by user ${req.user.userId}`);

    res.status(201).json({
      message: "Comment added successfully",
      commentCount: post.commentCount,
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { commentId } = req.params;
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404, "POST_NOT_FOUND");
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404, "COMMENT_NOT_FOUND");
    }

    const existingLikeIndex = comment.likes.findIndex(
      (like: { user: mongoose.Types.ObjectId; timestamp: Date }) =>
        like.user.toString() === req.user!.userId,
    );

    if (existingLikeIndex > -1) {
      comment.likes.splice(existingLikeIndex, 1);
    } else {
      comment.likes.push({
        user: new mongoose.Types.ObjectId(req.user.userId),
        timestamp: new Date(),
      });
    }

    await post.save();

    logger.info(
      `Comment ${commentId} liked/unliked by user ${req.user.userId}`,
    );

    res.json({
      message: "Comment like toggled",
      likeCount: comment.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

export const replyToComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { commentId } = req.params;
    const { postId, text } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404, "POST_NOT_FOUND");
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404, "COMMENT_NOT_FOUND");
    }

    comment.replies.push({
      text,
      author: new mongoose.Types.ObjectId(req.user.userId),
      likes: [],
      replies: [],
      createdAt: new Date(),
    });

    await post.save();

    logger.info(
      `Reply added to comment ${commentId} by user ${req.user.userId}`,
    );

    res.status(201).json({
      message: "Reply added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const tokenizePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      throw new AppError("Post not found", 404, "POST_NOT_FOUND");
    }

    if (post.userId.toString() !== req.user.userId) {
      throw new AppError(
        "Unauthorized to tokenize this post",
        403,
        "FORBIDDEN",
      );
    }

    if (post.tokenized) {
      throw new AppError("Post already tokenized", 400, "ALREADY_TOKENIZED");
    }

    const tokenMint = await solanaService.createToken(`Post-${id}`, "POST", 0);

    post.tokenized = true;
    post.tokenMintAddress = tokenMint;
    await post.save();

    logger.info(`Post ${id} tokenized with mint ${tokenMint}`);

    res.json({
      message: "Post tokenized successfully",
      tokenMintAddress: tokenMint,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username walletAddress")
      .select("-comments");

    const total = await Post.countDocuments();

    res.json({
      posts,
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
