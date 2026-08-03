const pool = require('../config/db');

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    let query = 'SELECT * FROM notifications WHERE user_role = ?';
    let params = [req.user.role];

    if (req.user.role === 'student') {
      const [studentRec] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
      if (studentRec.length > 0) {
        query += ' AND (student_id = ? OR student_id IS NULL)';
        params.push(studentRec[0].id);
      }
    }

    query += ' ORDER BY created_at DESC LIMIT 20';
    const [notifications] = await pool.execute(query, params);
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching notifications' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNotifications, markAsRead };
