const pool = require('../config/db');

// @desc    Mark attendance (Admin)
// @route   POST /api/attendance
// @access  Private/Admin
const markAttendance = async (req, res) => {
  const { student_id, subject_id, attendance_date, attendance_status, remarks } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO attendance (student_id, subject_id, attendance_date, attendance_status, remarks) 
       VALUES (?, ?, ?, ?, ?) 
       ON CONFLICT(student_id, subject_id, attendance_date) DO UPDATE SET attendance_status = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP`,
      [student_id, subject_id, attendance_date, attendance_status, remarks, attendance_status, remarks]
    );

    // Notify student about attendance update (Simple mock for now, ideally trigger an event)
    await pool.execute(
      `INSERT INTO notifications (title, message, user_role, student_id) VALUES (?, ?, ?, ?)`,
      ['Attendance Marked', `Your attendance for ${attendance_date} has been marked as ${attendance_status}.`, 'student', student_id]
    );

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error marking attendance' });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { student_id, subject_id, start_date, end_date } = req.query;
    let query = `
      SELECT a.*, s.full_name, s.roll_number, sub.subject_name 
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE 1=1
    `;
    const params = [];

    // If student, force filter by their own ID
    let finalStudentId = student_id;
    if (req.user.role === 'student') {
       const [studentRec] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
       if (studentRec.length > 0) finalStudentId = studentRec[0].id;
    }

    if (finalStudentId) {
      query += ' AND a.student_id = ?';
      params.push(finalStudentId);
    }
    if (subject_id) {
      query += ' AND a.subject_id = ?';
      params.push(subject_id);
    }
    if (start_date && end_date) {
      query += ' AND a.attendance_date BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY a.attendance_date DESC';
    const [records] = await pool.execute(query, params);
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching attendance' });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
const updateAttendance = async (req, res) => {
  const { attendance_status, remarks } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE attendance SET attendance_status = ?, remarks = ? WHERE id = ?',
      [attendance_status, remarks, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating attendance' });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
const deleteAttendance = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM attendance WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting attendance' });
  }
};

module.exports = { markAttendance, getAttendance, updateAttendance, deleteAttendance };
