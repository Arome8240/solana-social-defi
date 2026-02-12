import { Router } from "express";
import * as defiController from "../controllers/defiController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @swagger
 * /api/defi/stake:
 *   post:
 *     summary: Stake tokens in a pool
 *     tags: [DeFi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenMint
 *               - amount
 *               - poolId
 *             properties:
 *               tokenMint:
 *                 type: string
 *                 description: Token mint address to stake
 *               amount:
 *                 type: number
 *                 description: Amount to stake
 *               poolId:
 *                 type: string
 *                 description: Staking pool ID
 *     responses:
 *       200:
 *         description: Tokens staked successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/stake", authenticate, defiController.stake);

/**
 * @swagger
 * /api/defi/lend:
 *   post:
 *     summary: Lend tokens to earn interest
 *     tags: [DeFi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenMint
 *               - amount
 *             properties:
 *               tokenMint:
 *                 type: string
 *                 description: Token mint address to lend
 *               amount:
 *                 type: number
 *                 description: Amount to lend
 *     responses:
 *       200:
 *         description: Tokens lent successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/lend", authenticate, defiController.lend);

/**
 * @swagger
 * /api/defi/yields:
 *   get:
 *     summary: Get available yield opportunities
 *     tags: [DeFi]
 *     responses:
 *       200:
 *         description: Yield opportunities retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pools:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       apy:
 *                         type: number
 *                       tvl:
 *                         type: number
 *                       tokenMint:
 *                         type: string
 */
router.get("/yields", defiController.getYields);

export default router;
