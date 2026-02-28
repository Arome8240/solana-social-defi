import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { strictRateLimitMiddleware } from "../middleware/rateLimiter";

const router: Router = Router();

/**
 * @swagger
 * /api/auth/check-username:
 *   post:
 *     summary: Check if username is available
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: Desired username
 *     responses:
 *       200:
 *         description: Username availability status
 *       400:
 *         description: Username already taken
 */
router.post(
  "/check-username",
  strictRateLimitMiddleware,
  authController.checkUsername,
);

/**
 * @swagger
 * /api/auth/signup/send-otp:
 *   post:
 *     summary: Step 2 - Send OTP to email for signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - email
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *               username:
 *                 type: string
 *                 description: Unique username
 *               bio:
 *                 type: string
 *                 description: Optional bio
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User already exists or validation error
 */
router.post(
  "/signup/send-otp",
  strictRateLimitMiddleware,
  authController.signupSendOTP,
);

/**
 * @swagger
 * /api/auth/signup/verify-otp:
 *   post:
 *     summary: Step 3 - Verify OTP and complete signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - email
 *               - code
 *             properties:
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 description: 6-digit OTP code
 *     responses:
 *       201:
 *         description: Account created successfully with JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid or expired OTP
 */
router.post(
  "/signup/verify-otp",
  strictRateLimitMiddleware,
  authController.signupVerifyOTP,
);

/**
 * @swagger
 * /api/auth/login/send-otp:
 *   post:
 *     summary: Send OTP to email for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */
router.post(
  "/login/send-otp",
  strictRateLimitMiddleware,
  authController.loginSendOTP,
);

/**
 * @swagger
 * /api/auth/login/verify-otp:
 *   post:
 *     summary: Verify OTP and login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 description: 6-digit OTP code
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Invalid or expired OTP
 */
router.post(
  "/login/verify-otp",
  strictRateLimitMiddleware,
  authController.loginVerifyOTP,
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
 *     summary: Export wallet private key (requires OTP verification)
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
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 description: OTP code for verification
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
 *         description: Unauthorized or invalid OTP
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
