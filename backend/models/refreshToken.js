const mongoose = require("mongoose");

// Define the user schema
const refreshTokenSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true, 
        unique: true, 
    }, // The refresh token string
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
    }, // Reference to the associated user
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: "7d", 
    }, // Automatically delete the token after 7 days
});


// Add an index to optimize queries for token and userId
RefreshTokenSchema.index({ token: 1, userId: 1 });

// Create and export the user model
const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
module.exports = RefreshToken;