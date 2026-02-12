import { Router } from "express";
import * as nftController from "../controllers/nftController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @swagger
 * /api/nfts/mint:
 *   post:
 *     summary: Mint a new NFT
 *     tags: [NFTs]
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
 *               - symbol
 *               - uri
 *             properties:
 *               name:
 *                 type: string
 *                 description: NFT name
 *               symbol:
 *                 type: string
 *                 description: NFT symbol
 *               uri:
 *                 type: string
 *                 description: Metadata URI
 *     responses:
 *       201:
 *         description: NFT minted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mint:
 *                   type: string
 *                   description: NFT mint address
 *                 txSignature:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/mint", authenticate, nftController.mintNFT);

/**
 * @swagger
 * /api/nfts/transfer:
 *   post:
 *     summary: Transfer an NFT to another user
 *     tags: [NFTs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mint
 *               - toAddress
 *             properties:
 *               mint:
 *                 type: string
 *                 description: NFT mint address
 *               toAddress:
 *                 type: string
 *                 description: Recipient wallet address
 *     responses:
 *       200:
 *         description: NFT transferred successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: NFT not found
 */
router.post("/transfer", authenticate, nftController.transferNFT);

/**
 * @swagger
 * /api/nfts/{mint}:
 *   get:
 *     summary: Get NFT details by mint address
 *     tags: [NFTs]
 *     parameters:
 *       - in: path
 *         name: mint
 *         required: true
 *         schema:
 *           type: string
 *         description: NFT mint address
 *     responses:
 *       200:
 *         description: NFT details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mint:
 *                   type: string
 *                 name:
 *                   type: string
 *                 symbol:
 *                   type: string
 *                 uri:
 *                   type: string
 *                 owner:
 *                   type: string
 *       404:
 *         description: NFT not found
 */
router.get("/:mint", nftController.getNFT);

/**
 * @swagger
 * /api/nfts/user/collection:
 *   get:
 *     summary: Get user's NFT collection
 *     tags: [NFTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: NFT collection retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nfts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       mint:
 *                         type: string
 *                       name:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       uri:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/user/collection", authenticate, nftController.getUserNFTs);

export default router;
