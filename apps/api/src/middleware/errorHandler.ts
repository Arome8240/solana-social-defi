import { Request, Response } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
): void => {
  if (err instanceof AppError) {
    logger.error(`Operational Error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  logger.error("Unexpected Error:", {
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};
