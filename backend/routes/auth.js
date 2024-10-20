const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Registration Route: User registers account for the first time. POST is for submitting data, GET is for retreiving
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        // If user already exists...
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({message: `Email ${email} already registered`});
        }
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({message: `Email ${username} already registered`});
        }

        // PW hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({username, email, password: hashedPassword});
        await user.save();
        res.status(201).json({ message: `User ${user.username} registered successfully`});
        console.log("Success!");
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.log("Failure");
    }
});

// Login Route: User wants to login to existing account
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
        console.log("Login success");
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;