require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/users");

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL], // Replace with your frontend domain
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Use the auth routes for login and signup
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
