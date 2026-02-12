import { Router } from "express";
import * as miniAppController from "../controllers/miniAppController";
import { authenticate } from "../middleware/auth";
import { validate, schemas } from "../middleware/validation";

const router: Router = Router();

/**
 * @swagger
 * /api/mini-apps:
 *   post:
 *     summary: Create a new mini app
 *     tags: [Mini Apps]
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
 *               - description
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 description: Mini app name
 *               description:
 *                 type: string
 *                 description: Mini app description
 *               url:
 *                 type: string
 *                 description: Mini app URL
 *               icon:
 *                 type: string
 *                 description: Icon URL
 *     responses:
 *       201:
 *         description: Mini app created
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: List all mini apps
 *     tags: [Mini Apps]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of apps to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Mini apps retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apps:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.post(
  "/",
  authenticate,
  validate(schemas.createMiniApp),
  miniAppController.createMiniApp,
);

/**
 * @swagger
 * /api/mini-apps/{id}:
 *   get:
 *     summary: Get mini app details
 *     tags: [Mini Apps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mini app ID
 *     responses:
 *       200:
 *         description: Mini app retrieved
 *       404:
 *         description: Mini app not found
 *   patch:
 *     summary: Update mini app
 *     tags: [Mini Apps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mini app ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mini app updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mini app not found
 */
router.get("/:id", miniAppController.getMiniApp);
router.patch("/:id", authenticate, miniAppController.updateMiniApp);
router.get("/", miniAppController.listMiniApps);

export default router;
