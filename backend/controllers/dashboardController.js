const User = require("../models/user");
const jwt = require("jsonwebtoken");
const RefreshTokenModel = require("../models/refreshToken");

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ users }); // Return users as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

exports.updateProfile = async (req, res) => {
  console.log("updateProfile called with body:", req.body);
  const { username, oldPassword, newPassword } = req.body;
  console.log("username", username);
  const userId = req.user.userId; // req.user exists due to middleware/auth.js
  console.log("userId", userId);

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Update username
    if (username) {
      user.username = username;
    }

    // Update password (requires oldPassword verification)
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Old password required." });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect." });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }
    await user.save();
    console.log(`Profile updated for user: ${user}`);
    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Update refresh token in DB
    await RefreshTokenModel.findOneAndUpdate(
      { userId: user._id },
      { token: newRefreshToken },
      { upsert: true, new: true }
    );

    // Set new refresh token as HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error during update." });
  }
};

exports.updateProfilePicture = async (req, res) => {
  const userId = req.user.userId;
  console.log("updateProfilePicture", req.user);
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No image uploaded." });
  }

  const imageUrl = req.file.path; // Cloudinary-hosted URL

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePictureUrl: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated.",
      profilePictureUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
};
