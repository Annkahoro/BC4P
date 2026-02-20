const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Ordinary User)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { name, phone, location, clan } = req.body;

  try {
    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      phone,
      location: JSON.parse(location), // Location comes as stringified JSON from FormData
      profilePicture: req.file ? req.file.path : '',
      clan: clan || '',
      role: 'Contributor'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        location: user.location,
        profilePicture: user.profilePicture,
        clan: user.clan,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Login Ordinary User (Phone only)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (user && user.role === 'Contributor') {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        location: user.location,
        profilePicture: user.profilePicture,
        clan: user.clan,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone number or not a contributor' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Login Admin (Email/Password)
// @route   POST /api/auth/admin-login
// @access  Public
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        clan: user.clan,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      location: user.location,
      profilePicture: user.profilePicture,
      clan: user.clan
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
