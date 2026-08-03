const pool = require('../config/db');

const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// @desc    Add or Update marks (Admin)
// @route   POST /api/marks
// @access  Private/Admin
const addMarks = async (req, res) => {
  const { student_id, subject_id, internal_marks, external_marks, assignment_marks, lab_marks, project_marks, semester, remarks } = req.body;
  try {
    const internal = parseFloat(internal_marks || 0);
    const external = parseFloat(external_marks || 0);
    const assignment = parseFloat(assignment_marks || 0);
    const lab = parseFloat(lab_marks || 0);
    const project = parseFloat(project_marks || 0);
    
    const total = internal + external + assignment + lab + project;
    // Assuming max marks is 100 for simplicity, adjust later if subjects have varying max marks
    const percentage = total; 
    const grade = calculateGrade(percentage);

    // Check if record exists
    const [existing] = await pool.execute('SELECT id FROM marks WHERE student_id = ? AND subject_id = ?', [student_id, subject_id]);
    
    if (existing.length > 0) {
      await pool.execute(
        `UPDATE marks SET internal_marks=?, external_marks=?, assignment_marks=?, lab_marks=?, project_marks=?, total_marks=?, percentage=?, grade=?, remarks=?, semester=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [internal, external, assignment, lab, project, total, percentage, grade, remarks, semester, existing[0].id]
      );
    } else {
      await pool.execute(
        `INSERT INTO marks (student_id, subject_id, internal_marks, external_marks, assignment_marks, lab_marks, project_marks, total_marks, percentage, grade, remarks, semester) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [student_id, subject_id, internal, external, assignment, lab, project, total, percentage, grade, remarks, semester]
      );
    }

    // Notify student
    await pool.execute(
      `INSERT INTO notifications (title, message, user_role, student_id) VALUES (?, ?, ?, ?)`,
      ['Marks Updated', `Your marks have been updated. Grade: ${grade}`, 'student', student_id]
    );

    res.status(200).json({ message: 'Marks saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error saving marks' });
  }
};

// @desc    Get marks
// @route   GET /api/marks
// @access  Private
const getMarks = async (req, res) => {
  try {
    let finalStudentId = req.query.student_id;
    if (req.user.role === 'student') {
      const [studentRec] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
      if (studentRec.length > 0) finalStudentId = studentRec[0].id;
    }

    let query = `
      SELECT m.*, s.full_name, s.roll_number, sub.subject_name, sub.subject_code, sub.credits
      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN subjects sub ON m.subject_id = sub.id
      WHERE 1=1
    `;
    const params = [];

    if (finalStudentId) {
      query += ' AND m.student_id = ?';
      params.push(finalStudentId);
    }
    if (req.query.semester) {
      query += ' AND m.semester = ?';
      params.push(req.query.semester);
    }

    const [records] = await pool.execute(query, params);
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching marks' });
  }
};

module.exports = { addMarks, getMarks };
