const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  addMarks,
  getMarks
} = require('../controllers/marksController');

router.use(protect);

router.route('/')
  .get(getMarks)
  .post(admin, addMarks);

module.exports = router;
