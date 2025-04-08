const { Router } = require("express");
const authController = require("../controllers/authController");

router.post("/api/register", (req, res) => authController.signup(req, res));
