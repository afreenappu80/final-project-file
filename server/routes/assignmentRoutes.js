const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  upload,
  getAssignments,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission
} = require('../controllers/assignmentController');

router.use(protect);

router.route('/')
  .get(getAssignments)
  .post(admin, createAssignment);

router.route('/:id')
  .delete(admin, deleteAssignment);

router.post('/:id/submit', upload.single('file'), submitAssignment);
router.get('/:id/submissions', admin, getSubmissions);
router.put('/submissions/:id/grade', admin, gradeSubmission);

module.exports = router;
