const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = async function (req, res, next) {
  console.log("Checking JWT...");
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if token is still valid (exists in DB)
    const tokenInDb = await RefreshToken.findOne({ token });
    if (!tokenInDb) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }
    console.log("JWT verified successfully", decoded);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    console.error("Token validation failed:", err.message);
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};
