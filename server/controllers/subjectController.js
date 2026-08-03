const pool = require('../config/db');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  const { status } = req.query;
  try {
    let query = 'SELECT * FROM subjects';
    let params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY semester ASC, subject_name ASC';
    
    const [subjects] = await pool.execute(query, params);
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching subjects' });
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = async (req, res) => {
  const { subject_code, subject_name, department, semester, credits, faculty_name, status = 'Active' } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO subjects (subject_code, subject_name, department, semester, credits, faculty_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [subject_code, subject_name, department, semester, credits, faculty_name, status]
    );
    res.status(201).json({ id: result.insertId, subject_code, subject_name, status });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Subject Code already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error creating subject' });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = async (req, res) => {
  const { subject_code, subject_name, department, semester, credits, faculty_name, status } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE subjects SET subject_code = ?, subject_name = ?, department = ?, semester = ?, credits = ?, faculty_name = ?, status = ? WHERE id = ?',
      [subject_code, subject_name, department, semester, credits, faculty_name, status || 'Active', req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating subject' });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting subject' });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };
