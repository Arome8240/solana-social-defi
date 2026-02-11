import { Router } from "express";
import * as defiController from "../controllers/defiController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/stake", authenticate, defiController.stake);
router.post("/lend", authenticate, defiController.lend);
router.get("/yields", defiController.getYields);

export default router;
