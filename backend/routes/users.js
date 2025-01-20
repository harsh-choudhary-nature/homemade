const express = require("express");
const { allUsers, deleteAllUsers } = require("../controllers/dashboardController");

const router = express.Router();

// Define routes
router.get("/users", allUsers);

// Route to delete all users
router.delete('/delete-all-users', deleteAllUsers);

module.exports = router;
