const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getStudentDashboard, getAdminDashboard } = require('../controllers/dashboardController');

router.use(protect);

router.get('/student', getStudentDashboard);
router.get('/admin', getAdminDashboard);

module.exports = router;
