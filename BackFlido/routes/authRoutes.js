//Création des routes avec les fonction dans authController

const { Router } = require("express");
const authController = require("../controllers/authController");
const router = Router();

//Route POST pour créer l'utilisateur
router.post("/api/register", (req, res) => authController.signup(req, res));

//Exportation des routes pour les utiliser dans d'autres fichiers du backend
module.exports = router;
