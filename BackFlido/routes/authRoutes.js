const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.post("/api/register", (req, res) => authController.signup(req, res));

module.exports = router
