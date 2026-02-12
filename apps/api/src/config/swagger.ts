import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Solana Social DeFi API",
      version: "1.0.0",
      description:
        "Production-ready backend API for Solana mobile app with social, DeFi, messaging, and NFT features. Built with Express, MongoDB, and Solana Web3.js.",
      contact: {
        name: "API Support",
        email: "dev@arome.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
      {
        url: "https://api.solana-social.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication and wallet management endpoints",
      },
      {
        name: "Social",
        description: "Social features - posts, comments, likes, and feed",
      },
      {
        name: "Trades",
        description: "Token swaps and P2P trading",
      },
      {
        name: "DeFi",
        description: "Staking, lending, and yield farming",
      },
      {
        name: "NFTs",
        description: "NFT minting, transfers, and collections",
      },
      {
        name: "Rewards",
        description: "SKR token rewards for creators",
      },
      {
        name: "Messages",
        description: "Real-time messaging with GetStream",
      },
      {
        name: "Mini Apps",
        description: "Mini app marketplace and management",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer {token}",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            username: {
              type: "string",
            },
            email: {
              type: "string",
            },
            walletAddress: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["user", "creator", "admin"],
            },
            balances: {
              type: "object",
              properties: {
                sol: {
                  type: "number",
                },
                skr: {
                  type: "number",
                },
              },
            },
          },
        },
        Trade: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            fromUserId: {
              type: "string",
            },
            toUserId: {
              type: "string",
            },
            tokenMint: {
              type: "string",
            },
            amount: {
              type: "number",
            },
            status: {
              type: "string",
              enum: ["pending", "completed", "cancelled"],
            },
            txSignature: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customSiteTitle: "Solana Social DeFi API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
  console.log(
    `📚 Swagger docs available at http://localhost:${process.env.PORT || 3000}/api-docs`,
  );
};
