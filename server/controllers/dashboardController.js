const pool = require('../config/db');

// @desc    Get student dashboard analytics
// @route   GET /api/dashboard/student
// @access  Private/Student
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student details
    const [students] = await pool.execute('SELECT id, department, semester FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) return res.status(404).json({ message: 'Student not found' });
    const student = students[0];
    const studentId = student.id;

    // Calculate attendance percentage
    const [attendance] = await pool.execute('SELECT attendance_status FROM attendance WHERE student_id = ?', [studentId]);
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.attendance_status === 'Present').length;
    const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) + '%' : 'N/A';
    
    // Today's status
    const today = new Date().toISOString().split('T')[0];
    const [todayAtt] = await pool.execute('SELECT attendance_status FROM attendance WHERE student_id = ? AND attendance_date = ?', [studentId, today]);
    const todayStatus = todayAtt.length > 0 ? todayAtt[0].attendance_status : 'Not Marked';

    // Upcoming assignments (fetch from DB)
    const [assignments] = await pool.execute("SELECT a.*, s.subject_name FROM assignments a JOIN subjects s ON a.subject_id = s.id WHERE s.department LIKE '%' || ? || '%' AND s.semester = ? ORDER BY a.due_date DESC LIMIT 5", [student.department, student.semester]);

    const [marks] = await pool.execute('SELECT m.total_marks, m.percentage, s.subject_name FROM marks m JOIN subjects s ON m.subject_id = s.id WHERE m.student_id = ? ORDER BY m.created_at DESC LIMIT 5', [studentId]);

    // CGPA
    const [markTotal] = await pool.execute("SELECT AVG(percentage / 10) as cgpa FROM marks WHERE student_id = ? AND total_marks > 0", [studentId]);
    const cgpa = markTotal[0].cgpa ? Number(markTotal[0].cgpa).toFixed(2) : 'N/A';
    
    const rank = 'N/A'; // Compute later if needed

    res.json({
      attendancePercent,
      todayStatus,
      cgpa,
      rank,
      upcomingAssignments: assignments,
      recentMarks: marks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching student dashboard' });
  }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    // Total Students
    const [studentCount] = await pool.execute('SELECT COUNT(*) as count FROM students WHERE status = "Active"');
    
    // Total Subjects
    const [subjectCount] = await pool.execute('SELECT COUNT(*) as count FROM subjects');
    
    // Today's Attendance
    const today = new Date().toISOString().split('T')[0];
    const [todayAtt] = await pool.execute('SELECT attendance_status FROM attendance WHERE attendance_date = ?', [today]);
    
    const totalToday = todayAtt.length;
    const presentToday = todayAtt.filter(a => a.attendance_status === 'Present').length;
    const absentToday = totalToday - presentToday;
    const todayAttendancePercent = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) + '%' : '0%';
    
    // Average overall attendance
    const [allAtt] = await pool.execute('SELECT attendance_status FROM attendance');
    const totalAll = allAtt.length;
    const presentAll = allAtt.filter(a => a.attendance_status === 'Present').length;
    const avgAttendancePercent = totalAll > 0 ? Math.round((presentAll / totalAll) * 100) + '%' : '0%';

    // Average Marks & Pass Percentage
    const [marksData] = await pool.execute('SELECT percentage FROM marks');
    let avgMarks = '0%';
    let passPercentage = '0%';
    if (marksData.length > 0) {
      let totalPercentage = 0;
      let passedCount = 0;
      marksData.forEach(m => {
        totalPercentage += m.percentage;
        if (m.percentage >= 40) passedCount++; // Assuming 40% is pass
      });
      avgMarks = Math.round(totalPercentage / marksData.length) + '%';
      passPercentage = Math.round((passedCount / marksData.length) * 100) + '%';
    }

    // Faculty Count
    const [facultyData] = await pool.execute("SELECT COUNT(DISTINCT faculty_name) as count FROM subjects WHERE faculty_name IS NOT NULL AND faculty_name != ''");
    const totalFaculty = facultyData[0].count;

    // No activity logs table exists, return empty
    const activities = [];

    res.json({
      totalStudents: studentCount[0].count,
      totalSubjects: subjectCount[0].count,
      totalFaculty: totalFaculty,
      todayAttendance: todayAttendancePercent,
      presentStudents: presentToday,
      absentStudents: absentToday,
      averageAttendance: avgAttendancePercent,
      averageMarks: avgMarks,
      passPercentage: passPercentage,
      topPerformer: 'N/A', // Complex to calculate top performer without dedicated view
      recentActivities: activities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching admin dashboard' });
  }
};

module.exports = {
  getStudentDashboard,
  getAdminDashboard
};
