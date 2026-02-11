import { Router } from "express";
import * as rewardController from "../controllers/rewardController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post(
  "/claim",
  authenticate,
  authorize("creator", "admin"),
  rewardController.claimRewards,
);
router.get("/summary", authenticate, rewardController.getRewardsSummary);

export default router;
