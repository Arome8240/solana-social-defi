import { Router } from "express";
import * as nftController from "../controllers/nftController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/mint", authenticate, nftController.mintNFT);
router.post("/transfer", authenticate, nftController.transferNFT);
router.get("/:mint", nftController.getNFT);
router.get("/user/collection", authenticate, nftController.getUserNFTs);

export default router;
