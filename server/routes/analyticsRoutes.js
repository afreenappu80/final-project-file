const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAdminAnalytics, getStudentAnalytics } = require('../controllers/analyticsController');

router.use(protect);

router.get('/admin', getAdminAnalytics);
router.get('/student', getStudentAnalytics);

module.exports = router;
