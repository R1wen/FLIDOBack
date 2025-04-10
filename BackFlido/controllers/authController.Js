const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../middlewares/winston");

module.exports.signup = async (req, res) => {
  try {
    const { lastName, firstName, email, password } = req.body;

    if (!lastName || !firstName || !email || !password) {
      logger.warn("Erreur d'inscription: Champs manquants");
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Erreur d'inscription: ${email} existe déjà`);
      return res.status(409).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
