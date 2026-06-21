const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("EMAIL RECEIVED:", email);
    console.log("PASSWORD RECEIVED:", password);

    const user = await User.findOne({ email });

    console.log("USER:", user);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(401).json({ error: "User not found" });
    }

    console.log("HASH:", user.password);

    const match = await bcrypt.compare(password, user.password);

    console.log("MATCH:", match);

    if (!match) {
      console.log("❌ PASSWORD MISMATCH");
      return res.status(401).json({ error: "Password mismatch" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("✅ LOGIN SUCCESS");

    res.json({
      token,
      role: user.role,
      name: user.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;