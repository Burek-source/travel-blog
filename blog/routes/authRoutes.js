
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send('DB error');
        if (results.length === 0) return res.status(404).json({ msg: 'User not found' });

        const user = results[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        // Send token to client in an HTTP-only cookie (for security)
        res.cookie('token', token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Lax', 
        });
        res.json({ msg: 'Login successful' });
    });
});

module.exports = router;
