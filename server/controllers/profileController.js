const pool = require('../config/db');

// @desc    Get user profile (Student/Admin)
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const [students] = await pool.execute(`
        SELECT st.*, su.subject_name 
        FROM students st 
        LEFT JOIN subjects su ON st.subject_id = su.id 
        WHERE st.user_id = ?
      `, [req.user.id]);
      if (students.length === 0) return res.status(404).json({ message: 'Profile not found' });
      return res.json(students[0]);
    } else if (req.user.role === 'admin') {
      const [admins] = await pool.execute('SELECT * FROM admins WHERE user_id = ?', [req.user.id]);
      if (admins.length === 0) return res.status(404).json({ message: 'Admin Profile not found' });
      return res.json(admins[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching profile' });
  }
};

// @desc    Update user profile (Student)
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const { phone, address, profile_image } = req.body;
      const [result] = await pool.execute(
        'UPDATE students SET phone = ?, address = ?, profile_image = COALESCE(?, profile_image) WHERE user_id = ?',
        [phone, address, profile_image || null, req.user.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Profile not found' });
      res.json({ message: 'Student Profile updated successfully' });
    } else if (req.user.role === 'admin') {
      const { full_name, phone, profile_image } = req.body;
      const [result] = await pool.execute(
        'UPDATE admins SET full_name = ?, phone = ?, profile_image = COALESCE(?, profile_image) WHERE user_id = ?',
        [full_name, phone, profile_image || null, req.user.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Admin Profile not found' });
      res.json({ message: 'Admin Profile updated successfully' });
    } else {
      res.status(403).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
