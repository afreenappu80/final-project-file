const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'assignments');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `assignment_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === 'student') {
      const [studentRec] = await pool.execute('SELECT department, semester FROM students WHERE user_id = ?', [req.user.id]);
      if (studentRec.length > 0) {
        query = `
          SELECT a.*, s.subject_name, s.subject_code, s.semester 
          FROM assignments a
          JOIN subjects s ON a.subject_id = s.id
          WHERE s.department LIKE '%' || ? || '%' AND s.semester = ?
          ORDER BY a.due_date ASC
        `;
        params = [studentRec[0].department, studentRec[0].semester];
      } else {
        return res.status(404).json({ message: 'Student profile not found' });
      }
    } else {
      query = `
        SELECT a.*, s.subject_name, s.subject_code, s.semester 
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        ORDER BY a.due_date ASC
      `;
    }
    
    const [assignments] = await pool.execute(query, params);
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching assignments' });
  }
};

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private/Admin
const createAssignment = async (req, res) => {
  const { title, description, due_date, priority, subject_id } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO assignments (title, description, due_date, priority, subject_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, due_date, priority, subject_id, req.user.id]
    );

    // Notify students
    await pool.execute(
      `INSERT INTO notifications (title, message, user_role) VALUES (?, ?, ?)`,
      ['New Assignment', `A new assignment "${title}" has been posted. Due: ${due_date}`, 'student']
    );

    res.status(201).json({ id: result.insertId, title });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating assignment' });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin
const deleteAssignment = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM assignments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting assignment' });
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  try {
    const assignment_id = req.params.id;
    const [studentRec] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    if (studentRec.length === 0) return res.status(404).json({ message: 'Student profile not found' });
    const student_id = studentRec[0].id;
    
    const file_path = `/uploads/assignments/${req.file.filename}`;

    await pool.execute(
      `INSERT INTO assignment_submissions (assignment_id, student_id, file_path) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE file_path = ?, status = 'Submitted', submitted_at = CURRENT_TIMESTAMP`,
      [assignment_id, student_id, file_path, file_path]
    );

    res.status(200).json({ message: 'Assignment submitted successfully', file_path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error submitting assignment' });
  }
};

// @desc    Get submissions for an assignment (Admin)
// @route   GET /api/assignments/:id/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
  try {
    const query = `
      SELECT sub.*, s.full_name, s.roll_number 
      FROM assignment_submissions sub
      JOIN students s ON sub.student_id = s.id
      WHERE sub.assignment_id = ?
    `;
    const [submissions] = await pool.execute(query, [req.params.id]);
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching submissions' });
  }
};

// @desc    Grade submission
// @route   PUT /api/assignments/submissions/:id/grade
// @access  Private/Admin
const gradeSubmission = async (req, res) => {
  const { grade } = req.body;
  try {
    await pool.execute('UPDATE assignment_submissions SET status = ?, grade = ? WHERE id = ?', ['Graded', grade, req.params.id]);
    res.json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error grading submission' });
  }
};

module.exports = { 
  upload, 
  getAssignments, 
  createAssignment, 
  deleteAssignment, 
  submitAssignment, 
  getSubmissions, 
  gradeSubmission 
};
