const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly    = (req, res, next) => req.user?.role === 'admin'     ? next() : res.status(403).json({ message: 'Admin only' });
const donorOnly    = (req, res, next) => req.user?.role === 'donor'     ? next() : res.status(403).json({ message: 'Donor only' });
const volunteerOnly= (req, res, next) => req.user?.role === 'volunteer' ? next() : res.status(403).json({ message: 'Volunteer only' });

module.exports = { protect, adminOnly, donorOnly, volunteerOnly };