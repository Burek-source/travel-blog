
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
};
app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use(cookieParser());


require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const apiKey = process.env.API_KEY;

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL DB!');
});


const JWT_SECRET = 'your_jwt_secret';


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  
        next();  
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).json({ msg: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
        
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

           
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Lax',
            });

      
            res.json({
                msg: 'Login successful',
                token,
                user: { id: user.id, username: user.username, email: user.email, address: user.address }
            });
        } else {
            res.status(401).json({ msg: 'Incorrect password' });
        }
    });
});


// Routes for travel logs (requires authentication)
const travelLogRoutes = require('./routes/travelLogRoutes');
app.use('/travel-logs', authMiddleware, travelLogRoutes);

// Routes for journey plans (requires authentication)
const journeyPlanRoutes = require('./routes/journeyPlanRoutes');
app.use('/journey-plans', authMiddleware, journeyPlanRoutes);

app.post('/signup', async (req, res) => {
    const { username, password, email, address } = req.body;

    if (!username || !password || !email || !address) {
        return res.status(400).json({ msg: 'Please fill all fields.' });
    }

    // Check if username already exists
    db.query('SELECT id FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            return res.status(400).json({ msg: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, hashedPassword, email, address], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ msg: 'User created successfully.' });
        });
    });
});








app.get('/profile', authMiddleware, (req, res) => {
    const sql = 'SELECT username, email, address FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

app.put('/profile', authMiddleware, (req, res) => {
    const { email, address } = req.body;
    const sql = 'UPDATE users SET email = ?, address = ? WHERE id = ?';
    db.query(sql, [email, address, req.user.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ msg: 'User updated successfully' });
    });
});

app.delete('/profile', authMiddleware, (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.clearCookie('token');
        res.json({ msg: 'Account deleted successfully' });
    });
});

// Update password
app.put('/update-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Check if newPassword is provided
    if (!newPassword || !currentPassword) {
        return res.status(400).json({ msg: 'Please provide both current and new passwords' });
    }

    // Find the user from the database
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.user.id], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).json({ msg: 'User not found' });

        const user = results[0];

        // Compare current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Hash the new password and update in the database
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateSql, [hashedNewPassword, req.user.id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ msg: 'Password updated successfully' });
        });
    });
});







// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});

