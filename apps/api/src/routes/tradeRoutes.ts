import { Router } from "express";
import * as tradeController from "../controllers/tradeController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @swagger
 * /api/trades/swap:
 *   post:
 *     summary: Swap tokens using Jupiter aggregator
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromToken
 *               - toToken
 *               - amount
 *             properties:
 *               fromToken:
 *                 type: string
 *                 description: Source token mint address
 *               toToken:
 *                 type: string
 *                 description: Destination token mint address
 *               amount:
 *                 type: number
 *                 description: Amount to swap
 *     responses:
 *       200:
 *         description: Swap successful
 *       401:
 *         description: Unauthorized
 */
router.post("/swap", authenticate, tradeController.swap);

/**
 * @swagger
 * /api/trades/p2p:
 *   post:
 *     summary: Create a peer-to-peer trade offer
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toUserId
 *               - tokenMint
 *               - amount
 *             properties:
 *               toUserId:
 *                 type: string
 *                 description: Recipient user ID
 *               tokenMint:
 *                 type: string
 *                 description: Token mint address
 *               amount:
 *                 type: number
 *                 description: Amount to trade
 *     responses:
 *       201:
 *         description: Trade created
 *       401:
 *         description: Unauthorized
 */
router.post("/p2p", authenticate, tradeController.createP2PTrade);

/**
 * @swagger
 * /api/trades/p2p/{id}/accept:
 *   post:
 *     summary: Accept a pending P2P trade
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trade ID
 *     responses:
 *       200:
 *         description: Trade accepted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trade not found
 */
router.post("/p2p/:id/accept", authenticate, tradeController.acceptP2PTrade);

/**
 * @swagger
 * /api/trades/history:
 *   get:
 *     summary: Get user's trade history
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of trades to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Trade history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       fromUserId:
 *                         type: string
 *                       toUserId:
 *                         type: string
 *                       tokenMint:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [pending, completed, cancelled]
 *                       txSignature:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/history", authenticate, tradeController.getTradeHistory);

export default router;
