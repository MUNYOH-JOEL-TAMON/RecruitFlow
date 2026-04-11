const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware — validates JWT and attaches req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Support Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (exclude password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized. Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized. Token expired.' });
    }
    next(error);
  }
};

/**
 * Restrict middleware — limits access to specific roles
 * Usage: router.delete('/...', protect, restrict('admin'), handler)
 */
const restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized for this action.`,
      });
    }
    next();
  };
};

module.exports = { protect, restrict };
