import { Router } from "express";
import * as rewardController from "../controllers/rewardController";
import { authenticate, authorize } from "../middleware/auth";

const router: Router = Router();

/**
 * @swagger
 * /api/rewards/claim:
 *   post:
 *     summary: Claim accumulated SKR rewards (creators and admins only)
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rewards claimed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   description: Amount of SKR claimed
 *                 txSignature:
 *                   type: string
 *                   description: Transaction signature
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires creator or admin role
 */
router.post(
  "/claim",
  authenticate,
  authorize("creator", "admin"),
  rewardController.claimRewards,
);

/**
 * @swagger
 * /api/rewards/summary:
 *   get:
 *     summary: Get user's rewards summary
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rewards summary retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEarned:
 *                   type: number
 *                   description: Total SKR earned
 *                 pendingRewards:
 *                   type: number
 *                   description: Unclaimed rewards
 *                 breakdown:
 *                   type: object
 *                   properties:
 *                     likes:
 *                       type: number
 *                     comments:
 *                       type: number
 *                     posts:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/summary", authenticate, rewardController.getRewardsSummary);

export default router;
