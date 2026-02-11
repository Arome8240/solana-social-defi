import { Router } from "express";
import * as socialController from "../controllers/socialController";
import { authenticate } from "../middleware/auth";
import { validate, schemas } from "../middleware/validation";
import { rateLimitMiddleware } from "../middleware/rateLimiter";

const router = Router();

router.post(
  "/posts",
  authenticate,
  rateLimitMiddleware,
  validate(schemas.createPost),
  socialController.createPost,
);
router.get("/posts/:id", socialController.getPost);
router.post(
  "/posts/:id/like",
  authenticate,
  rateLimitMiddleware,
  socialController.likePost,
);
router.post(
  "/posts/:id/comment",
  authenticate,
  rateLimitMiddleware,
  validate(schemas.createComment),
  socialController.commentOnPost,
);
router.post("/posts/:id/tokenize", authenticate, socialController.tokenizePost);
router.get("/feed", socialController.getFeed);

router.post(
  "/comments/:commentId/like",
  authenticate,
  rateLimitMiddleware,
  socialController.likeComment,
);
router.post(
  "/comments/:commentId/reply",
  authenticate,
  rateLimitMiddleware,
  validate(schemas.createComment),
  socialController.replyToComment,
);

export default router;
