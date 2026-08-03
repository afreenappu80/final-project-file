const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

router.use(protect);

router.route('/')
  .get(getSubjects)
  .post(admin, createSubject);

router.route('/:id')
  .put(admin, updateSubject)
  .delete(admin, deleteSubject);

module.exports = router;
