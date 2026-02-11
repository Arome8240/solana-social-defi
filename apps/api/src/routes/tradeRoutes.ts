import { Router } from "express";
import * as tradeController from "../controllers/tradeController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/swap", authenticate, tradeController.swap);
router.post("/p2p", authenticate, tradeController.createP2PTrade);
router.post("/p2p/:id/accept", authenticate, tradeController.acceptP2PTrade);
router.get("/history", authenticate, tradeController.getTradeHistory);

export default router;
