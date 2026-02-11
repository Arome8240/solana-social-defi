import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000") / 1000,
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const key = req.ip || "unknown";
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      error: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }
};

// Stricter rate limiter for sensitive operations
export const strictRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

export const strictRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const key = req.ip || "unknown";
    await strictRateLimiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      error: "Too many requests, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }
};
