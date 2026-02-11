import { Router } from "express";
import * as miniAppController from "../controllers/miniAppController";
import { authenticate } from "../middleware/auth";
import { validate, schemas } from "../middleware/validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(schemas.createMiniApp),
  miniAppController.createMiniApp,
);
router.get("/:id", miniAppController.getMiniApp);
router.patch("/:id", authenticate, miniAppController.updateMiniApp);
router.get("/", miniAppController.listMiniApps);

export default router;
