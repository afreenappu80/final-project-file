const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

router.use(protect);

// Anyone logged in can view departments, only admin can modify
router.route('/')
  .get(getDepartments)
  .post(admin, createDepartment);

router.route('/:id')
  .put(admin, updateDepartment)
  .delete(admin, deleteDepartment);

module.exports = router;
