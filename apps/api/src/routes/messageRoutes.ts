import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @swagger
 * /api/messages/channels:
 *   post:
 *     summary: Create a new message channel
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *                 description: Channel name
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs
 *     responses:
 *       201:
 *         description: Channel created
 *       401:
 *         description: Unauthorized
 */
router.post("/channels", authenticate, messageController.createChannel);

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message to a channel
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channelId
 *               - content
 *             properties:
 *               channelId:
 *                 type: string
 *                 description: Channel ID
 *               content:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Message sent
 *       401:
 *         description: Unauthorized
 */
router.post("/send", authenticate, messageController.sendMessage);

/**
 * @swagger
 * /api/messages/channels/{id}:
 *   get:
 *     summary: Get messages from a channel
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to return
 *     responses:
 *       200:
 *         description: Messages retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 */
router.get("/channels/:id", authenticate, messageController.getChannelMessages);

/**
 * @swagger
 * /api/messages/token:
 *   get:
 *     summary: Get GetStream user token for real-time messaging
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: GetStream user token
 *       401:
 *         description: Unauthorized
 */
router.get("/token", authenticate, messageController.getUserToken);

export default router;
