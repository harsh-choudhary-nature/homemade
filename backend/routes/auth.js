const express = require("express");
const {
  sendOtp,
  login,
  signup,
  refreshToken,
} = require("../controllers/userController");

const router = express.Router();

// Define routes
router.post("/signup/send-otp", sendOtp);
router.post("/signup/register", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
