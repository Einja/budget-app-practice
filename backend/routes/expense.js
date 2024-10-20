const express = require('express');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');  // Middleware to protect the route

const router = express.Router();

// POST: Create a new expense
router.post('/', authMiddleware, async (req, res) => {
    const { amount, category, description, date } = req.body;
    try {
        const newExpense = new Expense({
            amount,
            category,
            description,
            date,
            user: req.user.userId // Assume JWT attaches the user to req.user
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET: Fetch all expenses for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.userId });
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT: Update an expense
router.put('/:id', authMiddleware, async (req, res) => {
    const { amount, category, description, date } = req.body;
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        if (expense.user.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: { amount, category, description, date } }, { new: true });
        res.json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE: Remove an expense
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        if (expense.user.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await Expense.findByIdAndRemove(req.params.id);
        res.json({ message: 'Expense removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
