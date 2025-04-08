const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/userModel");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

describe("Auth Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/register", () => {
    afterEach(async () => {
      await User.deleteOne({ email: "testuser@gmail.com" });
      await User.deleteOne({ email: "testuser1@gmail.com" });
    });

    it("should create a new user", async () => {
      const response = await request(app).post("/api/register").send({
        lastName: "TEST",
        firstName: "user",
        email: "testuser@gmail.com",
        password: "testpassword",
      });

      expect(response.status).toBe(201);
    });

    it("should return 400 if missing information", async () => {
      const response = await request(app).post("/api/register").send({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Tous les champs sont obligatoires.");
    });

    it("should return 409 if email already exists", async () => {
      await request(app).post("/api/register").send({
        lastName: "TEST",
        firstName: "user1",
        email: "testuser1@gmail.com",
        password: "testpassword",
      });

      const response = await request(app).post("/api/register").send({
        lastName: "TEST",
        firstName: "user1",
        email: "testuser1@gmail.com",
        password: "testpassword",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Email déjà utilisé");
    });
  });
});
