const express = require("express");
const { sendOtp, login, signup } = require("../controllers/userController");

const router = express.Router();

// Define routes
router.post("/signup/send-otp", sendOtp);
router.post("/signup/register", signup);
router.post("/login", login);

module.exports = router;
