const express = require("express");
const {
  allUsers,
  updateProfile,
} = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/auth");
const { deleteAccount } = require("../controllers/userController");

const router = express.Router();

// Define routes
router.get("/users", allUsers);
router.put("/user/update", authMiddleware, updateProfile);
router.put(
  "/user/profile-picture",
  authMiddleware,
  upload.single("profile"),
  updateProfilePicture
);
router.delete("/delete-account", deleteAccount);

module.exports = router;
