import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate, schemas } from "../middleware/validation";
import { strictRateLimitMiddleware } from "../middleware/rateLimiter";

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account with auto-generated wallet
 *     tags: [Auth]
 */
router.post(
  "/signup",
  strictRateLimitMiddleware,
  validate(schemas.signup),
  authController.signup,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 */
router.post(
  "/login",
  strictRateLimitMiddleware,
  validate(schemas.login),
  authController.login,
);

/**
 * @swagger
 * /api/auth/biometric:
 *   patch:
 *     summary: Toggle biometric authentication
 *     tags: [Auth]
 */
router.patch("/biometric", authenticate, authController.toggleBiometric);

/**
 * @swagger
 * /api/auth/export-private-key:
 *   post:
 *     summary: Export wallet private key (requires password)
 *     tags: [Auth]
 */
router.post(
  "/export-private-key",
  authenticate,
  strictRateLimitMiddleware,
  authController.exportPrivateKey,
);

/**
 * @swagger
 * /api/auth/wallet:
 *   get:
 *     summary: Get wallet information
 *     tags: [Auth]
 */
router.get("/wallet", authenticate, authController.getWalletInfo);

export default router;
