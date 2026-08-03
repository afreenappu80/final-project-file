const pool = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/jwt');

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
  const {
    full_name, student_id, roll_number, admission_number, email, phone, password,
    gender, dob = null, blood_group = null, department, branch, semester, section = null, year = null,
    address = null, parent_name = null, parent_phone = null
  } = req.body;

  try {
    // 1. Check if user already exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const [existingStudents] = await pool.execute(
      'SELECT id FROM students WHERE roll_number = ? OR student_id = ? OR admission_number = ?',
      [roll_number, student_id, admission_number]
    );
    if (existingStudents.length > 0) {
      return res.status(409).json({ message: 'Student ID, Roll Number, or Admission Number already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert into users table
    const [userResult] = await pool.execute(
      'INSERT INTO users (role, email, password) VALUES (?, ?, ?)',
      ['student', email, hashedPassword]
    );
    const userId = userResult.insertId;

    // 4. Insert into students table
    await pool.execute(
      `INSERT INTO students (
        user_id, student_id, roll_number, admission_number, full_name, email, phone,
        gender, dob, blood_group, department, branch, semester, section, year,
        address, parent_name, parent_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, student_id, roll_number, admission_number, full_name, email, phone,
        gender, dob, blood_group, department, branch, semester, section, year,
        address, parent_name, parent_phone
      ]
    );

    res.status(201).json({ message: 'Registration Successful!' });
  } catch (error) {
    console.error('Registration Error Details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Auth student & get token
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ? AND role = "student"', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const [students] = await pool.execute('SELECT full_name, profile_image FROM students WHERE user_id = ?', [user.id]);
    const studentInfo = students[0];

    generateToken(res, user.id, user.role);

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: studentInfo?.full_name,
      profile_image: studentInfo?.profile_image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body; // Expecting username or email, will check users.email first

  try {
    // For admin, we can check email in users, or username in admins. 
    // Let's assume login is via email for users table consistency, or we allow both.
    // For simplicity, let's assume the frontend sends 'username' which could be email.
    
    // First, try finding an admin in the admins table to get user_id
    const [admins] = await pool.execute('SELECT user_id, username FROM admins WHERE username = ?', [username]);
    
    let user;
    if (admins.length > 0) {
      const [users] = await pool.execute('SELECT * FROM users WHERE id = ? AND role = "admin"', [admins[0].user_id]);
      user = users[0];
    } else {
      // Fallback: check if they entered the admin's email
      const [users] = await pool.execute('SELECT * FROM users WHERE email = ? AND role = "admin"', [username]);
      user = users[0];
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    generateToken(res, user.id, user.role);

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      username: username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// TODO: Implement forgot-password and reset-password using nodemailer
const forgotPassword = async (req, res) => {
  res.status(501).json({ message: 'Forgot password not fully implemented yet' });
};

const resetPassword = async (req, res) => {
  res.status(501).json({ message: 'Reset password not fully implemented yet' });
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword
};
