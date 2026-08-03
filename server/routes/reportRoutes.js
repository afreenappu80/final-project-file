const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');

// Mock Reports Controller for Phase 2
// In a full application, this would query the DB and generate PDF/Excel buffers
const getReports = async (req, res) => {
  res.json({ message: 'Reports endpoint. Generate reports on client side using jsPDF/xlsx for Phase 2.' });
};

router.use(protect);
router.get('/', admin, getReports);

module.exports = router;
