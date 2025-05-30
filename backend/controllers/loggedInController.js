const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
