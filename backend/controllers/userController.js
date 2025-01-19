const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto"); // For generating unique tokens
const nodemailer = require("nodemailer"); // For sending emails

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Use environment variable
const FRONTEND_URL = process.env.FRONTEND_URL; // Use environment variable
const EMAIL = process.env.EMAIL; // Use environment variable
const PASSWORD = process.env.PASSWORD; // Use environment variable

// User Signup
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user with isVerified as false
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
    });

    // Save the user in the database
    await newUser.save();

    // Send a verification email
    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({
      message: "Signup successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "An error occurred during signup." });
  }
};

// Helper function to send the verification email
const sendVerificationEmail = async (email, link) => {
  // Configure the email transport
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email provider
    auth: {
      user: EMAIL, // Replace with your email
      pass: PASSWORD, // Replace with your email password or app password
    },
  });

  // Define the email options
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Thank you for signing up!</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${link}">Verify Email</a>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// User Email Verification
exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  try {
    // Find the user with the matching email and verification token
    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token." });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "An error occurred during email verification." });
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

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

exports.saveRefreshToken = async (userId, refreshToken, expiresIn) => {
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + expiresIn * 1000); // expiresIn is in seconds

  await User.findByIdAndUpdate(userId, {
    $push: {
      refreshTokens: {
        token: hashedToken,
        expiresAt,
      },
    },
  });
}

exports.validateRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId);

  if (!user) return false;

  const validToken = user.refreshTokens.find(async (t) => {
    return await bcrypt.compare(refreshToken, t.token) && t.expiresAt > Date.now();
  });

  return !!validToken; // Return true if a valid token is found
}

exports.revokeRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId);

  if (!user) return;

  const hashedToken = await bcrypt.hash(refreshToken, 10);

  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { token: hashedToken } },
  });
}

exports.cleanupExpiredTokens = async () => {
  await User.updateMany({}, { $pull: { refreshTokens: { expiresAt: { $lt: Date.now() } } } });
}