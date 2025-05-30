const express = require("express");
const { allUsers } = require("../controllers/dashboardController");
const { deleteAccount } = require("../controllers/userController");

const router = express.Router();

// Define routes
router.get("/users", allUsers);
router.delete("/delete-account", deleteAccount);

module.exports = router;
