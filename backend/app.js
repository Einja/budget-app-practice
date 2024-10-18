const express = require('express'); // For building web apps and APIs easier
const mongoose = require('mongoose'); // interact with MongoDB databases
const dotenv = require('dotenv'); // load environmental variables in .env files to process.env
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize the Express app
// Object will allow me to define routes, middleware, and other configurations for my server.
const app = express();

// Middleware
app.use(express.json()); // This middleware parses incoming requests with JSON payloads and makes the data accessible in req.body
app.use('/api/auth', authRoutes);

// Connect to MongoDB Atlas. So my DB is on the cloud and I can work anywhere :)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Basic route to confirm server is running
// Defines a simple GET route at the root URL (/). 
// When someone accesses this route, the server responds with the message "Budget Tracker API is running".
app.get('/', (req, res) => {
    res.send("Einju's Road to Hyperion:");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));