const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Otp = require("../models/Otp");
const RefreshToken = require("../models/refreshToken");
const crypto = require("crypto"); // For generating unique tokens
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const BACKEND_URL = process.env.BACKEND_URL;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.PASSWORD, // Replace with your app password
  },
});

function generateOtp(length = 6) {
  return crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, "0");
}

async function storeOtp(email, otp) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
}

async function getOtp(email) {
  const entry = await Otp.findOne({ email });
  if (!entry || new Date() > entry.expiresAt) {
    await Otp.deleteOne({ email });
    return null;
  }
  return entry.otp;
}

async function deleteOtp(email) {
  await Otp.deleteOne({ email });
}

async function sendOtpEmail(email, otp) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  });
  // Send the email
  await transporter.sendMail(info);
  // console.log("Email sent!")
}

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const otp = generateOtp();
    storeOtp(email, otp);

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

// User Signup
exports.signup = async (req, res) => {
  const { username, email, password, otp } = req.body;

  if (!username || !email || !password || !otp) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const storedOtp = await getOtp(email);
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not found." });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    await deleteOtp(email);

    // console.log(`Registered user: ${username}, ${email}`);
    res.status(200).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials." });

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    // Optionally remove old refresh tokens for the user
    await RefreshToken.deleteMany({ userId: user._id });

    // Save the new refresh token in DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log(`Logged in user: ${user.username}, ${email}`);
    // Send tokens to the client
    res.status(200).json({
      message: "Login successful.",
      username: user.username,
      email: user.email,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

exports.deleteAccount = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneAndDelete({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all blogs by this user
    // await Blog.deleteMany({ email: decoded.email });   // delete all posts of this user

    res.status(200).json({
      message: "Account and all associated blogs deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete account error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.logout = async (req, res) => {
  try {
    console.log("User attempting to log out");
    const token = req.cookies.refreshToken;
    if (!token) {
      console.log("No token found, no logout needed");
      return res.status(200).json({ message: "No content, no token found" });
    }

    // Remove token from database
    await RefreshToken.deleteOne({ token });

    // Clear cookie on client
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    console.log("User logged out");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(refreshToken, SECRET_KEY);
    // Optionally check if token exists in DB
    const savedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!savedToken) return res.status(403).json({ error: "Invalid token" });

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
