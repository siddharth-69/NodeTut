// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Initialize dotenv to access environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Dummy user for authentication (in a real-world app, this would be in a database)
const users = [
    {
        id: 1,
        username: 'testuser',
        password: bcrypt.hashSync('password123', 8), // Store the password securely using bcrypt
        role: 'admin',
    },
];

const PORT = process.env.PORT || 3000;

// Secret key (store this securely in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'mySuperSecretKey';

const authenticatedRoute = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')?.[1];

    if (!token) {
        res.status(403).json({ message: 'missing token' });
    }

    //Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'invalid token' });
        }

        req.user = user;
        next();
    });
}

// Login route to authenticate the user and generate a JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log(`******* User: ${username} is trying to login......`, req.headers);

    // Find the user by username
    const user = users.find(u => u.username === username);
    
    // If user is not found or password is incorrect, return an error
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT payload
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
    };

    // Generate a JWT token with an expiration time of 1 hour
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10s' });

    // Send the token to the client
    res.json({ token });
});
app.get('/profile', authenticatedRoute, (req, res) => {
    res.json({
        message: 'This is your profile',
        user: req.user
    })
})


app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`)
});
