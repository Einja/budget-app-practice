const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Registration Route: User registers account for the first time. POST is for submitting data, GET is for retreiving
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        // If user already exists...
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'Email ' + {email} + ' already registered'});
        }

        // PW hashing
        const hashedPassword = await bcrypt.hash(password, 32);

        // Create and save the new user
        const user = new User({username, email, password: hashedPassword});
        await user.save();
        res.status(201).json({ message: 'User ' + {username} + ' registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

module.exports = router;