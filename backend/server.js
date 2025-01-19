const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/users");

// Load environment variables from .env file
dotenv.config();

const app = express();

const corsOptions = {
    origin: [process.env.FRONTEND_URL], // Replace with your frontend domain
};

app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Use the auth routes for login and signup
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

// Connect to MongoDB
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("MongoDB connected");
    // Start the server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  }).catch(err => console.error("MongoDB connection error:", err));
