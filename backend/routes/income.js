const express = require('express');
const Income = require('../models/Income');
const authMiddleware = require('../middleware/auth');  // Middleware to protect the route

const router = express.Router();

// POST: Create a new income
router.post('/', authMiddleware, async (req, res) => {
    const { amount, source, description, date } = req.body;
    try {
        const newIncome = new Income({
            amount,
            source,
            description,
            date,
            user: req.user.userId // Attach user ID from JWT token
        });
        const savedIncome = await newIncome.save();
        res.status(201).json(savedIncome);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET: Fetch all income entries for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const incomeEntries = await Income.find({ user: req.user.userId });
        res.json(incomeEntries);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT: Update an income entry
router.put('/:id', authMiddleware, async (req, res) => {
    const { amount, source, description, date } = req.body;
    try {
        let income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.user.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        income = await Income.findByIdAndUpdate(req.params.id, { $set: { amount, source, description, date } }, { new: true });
        res.json(income);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE: Remove an income entry
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.user.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await Income.findByIdAndRemove(req.params.id);
        res.json({ message: 'Income entry removed' });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
