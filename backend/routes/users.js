const express = require("express");
const {
  allUsers,
  updateProfile,
  updateProfilePicture,
  getAuthenticatedUser,
} = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { deleteAccount } = require("../controllers/userController");

const router = express.Router();

// Define routes
router.get("/users", allUsers);
router.get("/user/me", authMiddleware, getAuthenticatedUser);
router.put("/user/update", authMiddleware, updateProfile);
router.put(
  "/user/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture
);
router.delete("/delete-account", deleteAccount);

module.exports = router;
