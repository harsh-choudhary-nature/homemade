const express = require("express");
const { signup, login, verifyEmail } = require("../controllers/userController");

const router = express.Router();

// Define routes
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/login", login);

module.exports = router;
