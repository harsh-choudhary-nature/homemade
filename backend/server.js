const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')

// Load environment variables from .env file
dotenv.config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000'], // Replace with your frontend domain
};

// Enable CORS for all routes
app.use(cors());

// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to my Express server.');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
