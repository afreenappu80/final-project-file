const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  loginAdmin,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/admin/login', loginAdmin);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/change-password', protect, changePassword);

module.exports = router;
