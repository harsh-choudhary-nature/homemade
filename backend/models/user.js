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
  username: {
    type: String,
    required: true,
  },

  profilePictureUrl: {
    type: String, // URL or base64 string
    default: null,
  },
});

// Create and export the user model
const User = mongoose.model("User", userSchema);
module.exports = User;
