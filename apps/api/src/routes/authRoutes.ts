import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate, schemas } from "../middleware/validation";
import { strictRateLimitMiddleware } from "../middleware/rateLimiter";

const router: Router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account with auto-generated wallet
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password (min 6 characters)
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     walletAddress:
 *                       type: string
 *                     balances:
 *                       type: object
 *       400:
 *         description: Validation error or user already exists
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enabled
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 description: Enable or disable biometric auth
 *     responses:
 *       200:
 *         description: Biometric setting updated
 *       401:
 *         description: Unauthorized
 */
router.patch("/biometric", authenticate, authController.toggleBiometric);

/**
 * @swagger
 * /api/auth/export-private-key:
 *   post:
 *     summary: Export wallet private key (requires password)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password for verification
 *     responses:
 *       200:
 *         description: Private key exported
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 privateKey:
 *                   type: string
 *                   description: Base58 encoded private key
 *       401:
 *         description: Unauthorized or invalid password
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 walletAddress:
 *                   type: string
 *                   description: Solana wallet public key
 *                 balances:
 *                   type: object
 *                   properties:
 *                     sol:
 *                       type: number
 *                     skr:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/wallet", authenticate, authController.getWalletInfo);

export default router;
