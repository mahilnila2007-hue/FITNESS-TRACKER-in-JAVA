const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (in production, use a real database)
const users = [];

// Helper function to find user by email
const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

// Routes

// Home route - redirect to login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    if (findUserByEmail(email)) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password, // In production, hash the password!
        createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        message: 'Registration successful',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Login successful
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Get user profile (optional - for future use)
app.get('/api/user/:email', (req, res) => {
    const user = findUserByEmail(req.params.email);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', users: users.length });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Fitness Tracker server is running on http://localhost:${PORT}`);
    console.log(`📊 Open your browser and navigate to http://localhost:${PORT}`);
});
