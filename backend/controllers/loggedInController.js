const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken");

const SECRET_KEY = process.env.JWT_SECRET_KEY; 

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken) return res.status(401).json({ error: "Refresh token missing." });
  
    try {
        const payload = jwt.verify(refreshToken, SECRET_KEY);
        
        // Query the database for the refresh token associated with the current user
        const storedToken = await RefreshToken.findOne({ 
            token: refreshToken, 
            userId: payload.userId 
        });
        
        if (!storedToken) {
            return res.status(403).json({ error: "Invalid or expired refresh token." });
        }

        const newAccessToken = jwt.sign({ userId: payload.userId, email: payload.email }, SECRET_KEY, { expiresIn: "15m" });
  
        // Generate a new refresh token
        const newRefreshToken = jwt.sign(
            { userId: payload.userId, email: payload.email },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        // Save the new refresh token in the database
        await RefreshToken.create({ token: newRefreshToken, userId: payload.userId });

        // Remove the old refresh token from the database
        await RefreshToken.deleteOne({ token: refreshToken });

        // Send the new refresh token as an HTTP-only cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(403).json({ error: "Invalid or expired refresh token." });
    }
};

exports.allRefreshTokens = async (req, res) => {
    try {
        // Check if the user is authorized to view all refresh tokens (e.g., admin)
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
    
        // Retrieve all refresh tokens from the database
        const tokens = await RefreshToken.find().populate("userId", "email");
    
        // Send the list of tokens to the client
        res.status(200).json({
            message: "All refresh tokens retrieved successfully.",
            tokens,
        });
    } catch (error) {
        console.error("Error retrieving refresh tokens:", error);
        res.status(500).json({ error: "An error occurred while retrieving tokens." });
    }
  };
  