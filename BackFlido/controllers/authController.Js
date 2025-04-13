/**
 * Definissions des fonctions qui seront associées
 * aux futurs routes dans authRoutes.js
 */

const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../middlewares/winston");

module.exports.signup = async (req, res) => {
  try {
    //Chercher le nom, prénom, mail et mot de passe dans le requete
    const { lastName, firstName, email, password } = req.body;

    //Vérifie si tous les éléments sont présents sinon renvoie une erreur
    if (!lastName || !firstName || !email || !password) {
      logger.warn("Erreur d'inscription: Champs manquants");
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires." });
    }

    /**
     * Cherche l'email dans la base de données
     * et renvoie une erreur si il existe déjà
     */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Erreur d'inscription: ${email} existe déjà`);
      return res.status(409).json({ error: "Email déjà utilisé" });
    }

    //Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    //Création de l'utilisateur en accord avec le schéma dans userModel
    const newUser = new User({
      lastName,
      firstName,
      email,
      password: hashedPassword,
    });

    // Sauvegarder dans la base de données
    await newUser.save();

    logger.info(`Utilisateur créer`, "userID: ", newUser._id);
    res.status(201).json({ success: true });
  } catch (error) {
    logger.error("Erreur durant l'inscription", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur." });
  }
};
