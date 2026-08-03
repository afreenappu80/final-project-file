const pool = require('../config/db');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const [departments] = await pool.execute('SELECT * FROM departments ORDER BY department_name ASC');
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching departments' });
  }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  const { department_name, hod_name } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO departments (department_name, hod_name) VALUES (?, ?)',
      [department_name, hod_name]
    );
    res.status(201).json({ id: result.insertId, department_name, hod_name });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Department already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error creating department' });
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  const { department_name, hod_name } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE departments SET department_name = ?, hod_name = ? WHERE id = ?',
      [department_name, hod_name, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating department' });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM departments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting department' });
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
