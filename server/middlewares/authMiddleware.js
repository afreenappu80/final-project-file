const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // We attach the user ID and role to the request
      req.user = { id: decoded.userId, role: decoded.role };

      // Optional: Check if user still exists in DB
      const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [req.user.id]);
      if (users.length === 0) {
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
        return res.status(401).json({ message: 'User not found, token invalid' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const student = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a student' });
  }
};

module.exports = { protect, admin, student };
