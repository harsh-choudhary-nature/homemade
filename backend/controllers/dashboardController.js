const User = require("../models/user");

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
  const { username, oldPassword, newPassword } = req.body;
  const userId = req.user.userId; // req.user exists due to middleware/auth.js

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
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error during update." });
  }
};

exports.updateProfilePicture = async (req, res) => {
  const userId = req.user.userId;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No image uploaded." });
  }

  const imageUrl = req.file.path; // Cloudinary-hosted URL

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated.",
      profilePicture: imageUrl,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error." });
  }
};
