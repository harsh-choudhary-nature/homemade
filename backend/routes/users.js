const express = require("express");
const { allUsers } = require("../controllers/dashboardController");

const router = express.Router();

// Define routes
router.get("/users", allUsers);

module.exports = router;
