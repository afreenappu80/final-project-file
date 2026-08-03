const pool = require('../config/db');

// @desc    Get all students (Admin)
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Search by name or roll number
    const search = req.query.search || '';
    
    let query = `
      SELECT st.id, st.user_id, st.student_id, st.roll_number, st.full_name, st.email, st.phone, st.department, st.semester, st.status, st.profile_image, st.created_at, su.subject_name
      FROM students st
      LEFT JOIN subjects su ON st.subject_id = su.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM students st';
    let queryParams = [];
    
    if (search) {
      query += ' WHERE st.full_name LIKE ? OR st.roll_number LIKE ?';
      countQuery += ' WHERE st.full_name LIKE ? OR st.roll_number LIKE ?';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY st.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.query(query, queryParams.map(p => isNaN(p) ? p : Number(p)));
    const [countResult] = await pool.query(countQuery, search ? [`%${search}%`, `%${search}%`] : []);
    
    res.json({
      students: rows,
      total: countResult[0].total,
      page,
      pages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching students' });
  }
};

// @desc    Get single student (Admin)
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
  try {
    const [students] = await pool.execute(`
      SELECT st.*, su.subject_name 
      FROM students st 
      LEFT JOIN subjects su ON st.subject_id = su.id 
      WHERE st.id = ?
    `, [req.params.id]);
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(students[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching student' });
  }
};

// @desc    Create a student (Admin)
// @route   POST /api/students
// @access  Private/Admin
const bcrypt = require('bcrypt');

const createStudent = async (req, res) => {
  let { student_id, roll_number, admission_number, department, branch, semester, full_name, email, phone, gender, password, subject_id } = req.body;

  // Handle optional integer/unique fields
  semester = semester ? parseInt(semester) : null;
  admission_number = admission_number || `ADM-${Date.now()}`;
  branch = branch || null;
  phone = phone || null;
  department = department || null;

  try {
    const [userExists] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (userExists.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const [studentExists] = await pool.execute('SELECT * FROM students WHERE student_id = ? OR roll_number = ?', [student_id, roll_number]);
    if (studentExists.length > 0) return res.status(400).json({ message: 'Student ID or Roll Number already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [userResult] = await pool.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'student']
    );

    const user_id = userResult.insertId;

    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.execute(
      'INSERT INTO students (user_id, student_id, roll_number, admission_number, full_name, email, phone, gender, department, branch, semester, subject_id, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, student_id, roll_number, admission_number, full_name, email, phone, gender, department, branch, semester, subject_id || null, profile_image]
    );

    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding student' });
  }
};

// @desc    Update student (Admin)
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  const {
    full_name, phone, department, branch, semester, section, address
  } = req.body;

  try {
    let query = 'UPDATE students SET full_name = ?, phone = ?, department = ?, branch = ?, semester = ?, section = ?, address = ?';
    let params = [full_name, phone, department, branch, semester, section, address];

    if (req.file) {
      query += ', profile_image = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating student' });
  }
};

// @desc    Delete student (Admin - Soft Delete/Hard Delete)
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    // Let's implement soft delete (update status) as per requirements, or hard delete if they really want.
    // Requirements say: "Confirmation dialog before delete. Soft Delete support."
    const [result] = await pool.execute('UPDATE students SET status = "Inactive" WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted (soft) successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting student' });
  }
};

// @desc    Update student status
// @route   PATCH /api/students/:id/status
// @access  Private/Admin
const updateStudentStatus = async (req, res) => {
  const { status } = req.body;
  if (status !== 'Active' && status !== 'Inactive') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const [result] = await pool.execute('UPDATE students SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: `Student status updated to ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating student status' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentStatus
};
