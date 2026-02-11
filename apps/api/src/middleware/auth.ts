import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "No token provided", code: "AUTH_NO_TOKEN" });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || "default-secret";

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res
      .status(401)
      .json({ error: "Invalid or expired token", code: "AUTH_INVALID_TOKEN" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ error: "Unauthorized", code: "AUTH_UNAUTHORIZED" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden", code: "AUTH_FORBIDDEN" });
      return;
    }

    next();
  };
};
