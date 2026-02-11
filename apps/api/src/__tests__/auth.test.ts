import request from "supertest";
import app from "../index";
import User from "../models/User";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    // Setup test database connection
  });

  afterAll(async () => {
    // Cleanup
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should reject duplicate email", async () => {
      await User.create({
        username: "existing",
        email: "existing@example.com",
        passwordHash: "hash",
      });

      const response = await request(app).post("/api/auth/signup").send({
        username: "newuser",
        email: "existing@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // Test implementation
    });

    it("should reject invalid credentials", async () => {
      // Test implementation
    });
  });
});
