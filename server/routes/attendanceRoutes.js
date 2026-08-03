const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');

router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(admin, markAttendance);

router.route('/:id')
  .put(admin, updateAttendance)
  .delete(admin, deleteAttendance);

module.exports = router;
