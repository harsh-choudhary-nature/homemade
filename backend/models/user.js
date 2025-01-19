const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,   // User is not verified initially
  },
  verificationToken: {
    type: String,     // Store the unique token for email verification
  },
  refreshTokens: [    // multiple refresh tokens for multiple devices handling
    {
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

// Create and export the user model
const User = mongoose.model("User", userSchema);
module.exports = User;