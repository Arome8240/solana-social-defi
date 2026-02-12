import { Router } from "express";
import * as socialController from "../controllers/socialController";
import { authenticate } from "../middleware/auth";
import { validate, schemas } from "../middleware/validation";
import { rateLimitMiddleware } from "../middleware/rateLimiter";

const router: Router = Router();

/**
 * @swagger
 * /api/social/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Post content
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Media URLs
 *     responses:
 *       201:
 *         description: Post created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/posts",
  authenticate,
  rateLimitMiddleware,
  validate(schemas.createPost),
  socialController.createPost,
);

/**
 * @swagger
 * /api/social/posts/{id}:
 *   get:
 *     summary: Get a specific post
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved
 *       404:
 *         description: Post not found
 */
router.get("/posts/:id", socialController.getPost);

/**
 * @swagger
 * /api/social/posts/{id}/like:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked/unliked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post(
  "/posts/:id/like",
  authenticate,
  rateLimitMiddleware,
  socialController.likePost,
);

/**
 * @swagger
 * /api/social/posts/{id}/comment:
 *   post:
 *     summary: Comment on a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *     responses:
 *       201:
 *         description: Comment created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post(
  "/posts/:id/comment",
  authenticate,
  rateLimitMiddleware,
  validate(schemas.createComment),
  socialController.commentOnPost,
);

/**
 * @swagger
 * /api/social/posts/{id}/tokenize:
 *   post:
 *     summary: Tokenize a post as an NFT
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post tokenized
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post("/posts/:id/tokenize", authenticate, socialController.tokenizePost);

/**
 * @swagger
 * /api/social/feed:
 *   get:
 *     summary: Get social feed
 *     tags: [Social]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of posts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Feed retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/feed", socialController.getFeed);

/**
 * @swagger
 * /api/social/comments/{commentId}/like:
 *   post:
 *     summary: Like or unlike a comment
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment liked/unliked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.post(
  "/comments/:commentId/like",
  authenticate,
  rateLimitMiddleware,
  socialController.likeComment,
);

/**
 * @swagger
 * /api/social/comments/{commentId}/reply:
 *   post:
 *     summary: Reply to a comment
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Reply content
 *     responses:
 *       201:
 *         description: Reply created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.post(
  "/comments/:commentId/reply",
  authenticate,
  rateLimitMiddleware,
  validate(schemas.createComment),
  socialController.replyToComment,
);

export default router;
