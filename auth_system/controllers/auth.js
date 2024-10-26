// controllers/authController.js
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log('User is trying to register', username, email, password);
  res.status(200).json({ message: "Registered" });

  // try {
  //   const userExists = await User.findOne({ email });
  //   if (userExists) return res.status(400).json({ message: 'User already exists' });

  //   const user = await User.create({ username, email, password });
  //   const token = generateToken(user._id);
  //   res.cookie('token', token, { httpOnly: true }).status(201).json({ message: 'User registered' });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout User
exports.logoutUser = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
};
