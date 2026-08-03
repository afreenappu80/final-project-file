const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentStatus
} = require('../controllers/studentController');
const upload = require('../middlewares/uploadMiddleware');

// All routes here are protected and admin only
router.use(protect);
router.use(admin);

router.route('/')
  .get(getStudents)
  .post(upload.single('profile_image'), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(upload.single('profile_image'), updateStudent)
  .delete(deleteStudent);

router.patch('/:id/status', updateStudentStatus);

module.exports = router;
