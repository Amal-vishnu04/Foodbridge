const User = require('../models/User');
const jwt  = require('jsonwebtoken');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    console.log('Register body:', req.body); // debug

    const { name, email, password, role, phone, organizationName } = req.body;

    // Check required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, password and phone are required' });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor',
      phone,
      organizationName: organizationName || '',
    });

    const token = genToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organizationName: user.organizationName,
      }
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err.message); // debug
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login body:', req.body); // debug

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = genToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organizationName: user.organizationName,
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};