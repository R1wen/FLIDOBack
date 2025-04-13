//Création des tests unitaires

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/userModel");

//Création d'un second fichier de variable d'environnement pour les tests
//Simple convention
dotenv.config({ path: ".env.test" });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);

//Timer mis à 10s pour chaque test avant arret automatique
jest.setTimeout(10000);

/**
 * Mock (simulation) de bcrypt pour renvoyer "hashedPassword" comme mot de passe
 * lors des tests, on teste les routes, pas bcrypt donc ca rend plus
 * simple
 */
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

//On defini le teste comme "Auth Routes"
describe("Auth Routes", () => {
  //Connexion à la BD avant les testes
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  //Deconnexion de la BD après les testes
  afterAll(async () => {
    await mongoose.connection.close();
  });

  //Premier vrai test sur la route POST
  describe("POST /api/register", () => {
    //Supprime les utilisateurs après tout les tests
    afterEach(async () => {
      await User.deleteOne({ email: "testuser@gmail.com" });
      await User.deleteOne({ email: "testuser1@gmail.com" });
    });

    //Premier test de la route POST, création d'un utilisateur
    it("should create a new user", async () => {
      //Envoie d'un JSON sur la route /api/register pour créer un utilisateur
      const response = await request(app).post("/api/register").send({
        lastName: "TEST",
        firstName: "user",
        email: "testuser@gmail.com",
        password: "testpassword",
      });

      //Réponse attendue en accord avec la fonction dans authController
      expect(response.status).toBe(201);
    });

    //Second test, erreur lorsque des informations manquantes
    it("should return 400 if missing information", async () => {
      //Création d'un utilisateur sans informations
      const response = await request(app).post("/api/register").send({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
      });

      //Réponse attendue
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Tous les champs sont obligatoires.");
    });

    //Dernier test, lorsque le mail existe déjà
    it("should return 409 if email already exists", async (req, res) => {
      //Création de l'utilisateur
      await request(app).post("/api/register").send({
        lastName: "TEST",
        firstName: "usera",
        email: "testuser1@gmail.com",
        password: "testpassword",
      });

      //Création d'un autre utilisateur avec le meme mail
      const response = await request(app).post("/api/register").send({
        lastName: "TEST",
        firstName: "usera",
        email: "testuser1@gmail.com",
        password: "testpassword",
      });

      //Réponse attendue
      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Email déjà utilisé");

      /**
       * à noter que ce dernier test ne fonctionne pas
       * En pratique réelle avec Postman, le status 409
       * et le message d'error sont bien renvoyez
       * Mais dans le test unitaire il y a un depassement de délais
       * le test est surement mal écrit vu que les réponses sont bien renvoyez
       */
    });
  });
});
