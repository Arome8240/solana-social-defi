import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/channels", authenticate, messageController.createChannel);
router.post("/send", authenticate, messageController.sendMessage);
router.get("/channels/:id", authenticate, messageController.getChannelMessages);
router.get("/token", authenticate, messageController.getUserToken);

export default router;
