const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

// Load environment variables from .env file
dotenv.config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000'], // Replace with your frontend domain
};

app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Use the auth routes for login and signup
app.use("/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});