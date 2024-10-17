const express = require('express'); // For building web apps and APIs easier
const mongoose = require('mongoose'); // interact with MongoDB databases
const dotenv = require('dotenv'); // load environmental variables in .env files to process.env

// Load environment variables
dotenv.config();

// Initialize the Express app
// Object will allow me to define routes, middleware, and other configurations for my server.
const app = express();

// Middleware
app.use(express.json()); // This middleware parses incoming requests with JSON payloads and makes the data accessible in req.body


// Basic route to confirm server is running
// Defines a simple GET route at the root URL (/). 
// When someone accesses this route, the server responds with the message "Budget Tracker API is running".
app.get('/', (req, res) => {
    res.send('Budget Tracker API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));