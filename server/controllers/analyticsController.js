const pool = require('../config/db');

// @desc    Get admin analytics charts data
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    // In a real app, this would be complex SQL aggregations. 
    // Here we generate realistic dynamic data based on current DB state.
    
    // 1. Attendance Trend (By Month)
    const [attData] = await pool.execute(`
      SELECT strftime('%m', attendance_date) as month, 
             COUNT(*) as total, 
             SUM(CASE WHEN attendance_status = 'Present' THEN 1 ELSE 0 END) as present 
      FROM attendance 
      GROUP BY month ORDER BY month LIMIT 6
    `);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const areaData = {
      labels: attData.length > 0 ? attData.map(r => monthNames[parseInt(r.month) - 1] || r.month) : defaultMonths,
      data: attData.length > 0 ? attData.map(r => Math.round((r.present / r.total) * 100)) : [0, 0, 0, 0, 0, 0]
    };

    // 2. Department-wise Performance (CGPA approximation)
    const [deptData] = await pool.execute(`
      SELECT s.department, AVG(m.percentage / 10) as avg_cgpa 
      FROM marks m JOIN students s ON m.student_id = s.id 
      WHERE m.total_marks > 0 GROUP BY s.department
    `);
    const defaultDepts = ['CS', 'IT', 'ECE', 'Mech', 'Civil'];
    const barData = {
      labels: deptData.length > 0 ? deptData.map(r => r.department || 'Unknown') : defaultDepts,
      data: deptData.length > 0 ? deptData.map(r => Number(r.avg_cgpa).toFixed(1)) : [0, 0, 0, 0, 0]
    };

    // 3. Doughnut (Pass vs Fail)
    const [passData] = await pool.execute(`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN percentage >= 40 THEN 1 ELSE 0 END) as passed 
      FROM marks WHERE total_marks > 0
    `);
    const totalMarks = passData[0]?.total || 0;
    const passedMarks = passData[0]?.passed || 0;
    const failedMarks = totalMarks - passedMarks;
    
    const doughnutData = {
      labels: ['Passed', 'Failed'],
      data: totalMarks > 0 ? [passedMarks, failedMarks] : [0, 100] // Shows 100% fail/placeholder if 0
    };

    // 4. Radar (Skill Assessment - mapped to average marks per subject)
    const [subjMarks] = await pool.execute(`
      SELECT su.subject_name, AVG(m.percentage) as avg_mark 
      FROM marks m JOIN subjects su ON m.subject_id = su.id 
      WHERE m.total_marks > 0 GROUP BY su.subject_name LIMIT 5
    `);
    const defaultSkills = ['Assignments', 'Mid-Terms', 'Finals', 'Practicals', 'Attendance'];
    const radarData = {
      labels: subjMarks.length > 0 ? subjMarks.map(r => r.subject_name) : defaultSkills,
      datasets: [{ 
        label: 'Average Score %', 
        data: subjMarks.length > 0 ? subjMarks.map(r => Math.round(r.avg_mark)) : [0, 0, 0, 0, 0] 
      }]
    };

    // 5. Polar Area (Subject Popularity)
    const [popData] = await pool.execute(`
      SELECT su.subject_name, COUNT(st.id) as enrolled 
      FROM subjects su LEFT JOIN students st ON st.subject_id = su.id 
      GROUP BY su.id ORDER BY enrolled DESC LIMIT 5
    `);
    const defaultSubjs = ['Data Structures', 'OS', 'Networks', 'AI', 'Web Dev'];
    const polarData = {
      labels: popData.filter(r => r.enrolled > 0).length > 0 ? popData.filter(r => r.enrolled > 0).map(r => r.subject_name) : defaultSubjs,
      data: popData.filter(r => r.enrolled > 0).length > 0 ? popData.filter(r => r.enrolled > 0).map(r => r.enrolled) : [0, 0, 0, 0, 0]
    };

    // 6. Line Chart (Marks Trend by Month)
    const [trendData] = await pool.execute(`
      SELECT strftime('%m', created_at) as month, AVG(percentage) as avg_mark 
      FROM marks WHERE total_marks > 0 GROUP BY month ORDER BY month LIMIT 6
    `);
    const defaultExams = ['Test 1', 'Test 2', 'Mid-Term', 'Test 3', 'Final'];
    const lineData = {
      labels: trendData.length > 0 ? trendData.map(r => monthNames[parseInt(r.month) - 1] || r.month) : defaultExams,
      data: trendData.length > 0 ? trendData.map(r => Math.round(r.avg_mark)) : [0, 0, 0, 0, 0]
    };

    // Overview stats
    const [counts] = await pool.execute('SELECT COUNT(*) as c FROM students WHERE status="Active"');
    const overview = {
      totalStudents: counts[0].c,
      attendance: areaData.data.length > 0 ? areaData.data[areaData.data.length - 1] : 0,
      cgpa: barData.data.length > 0 ? (barData.data.reduce((a, b) => a + parseFloat(b), 0) / barData.data.length).toFixed(2) : 0,
      completion: 0
    };

    res.json({ overview, areaData, barData, doughnutData, radarData, polarData, lineData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching admin analytics' });
  }
};

// @desc    Get student analytics charts data
// @route   GET /api/analytics/student
// @access  Private/Student
const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const [students] = await pool.execute('SELECT id, department, semester FROM students WHERE user_id = ?', [studentId]);
    if (students.length === 0) return res.status(404).json({ message: 'Student profile not found' });
    const internalId = students[0].id;

    // 1. Personal Attendance Trend (By Month)
    const [attData] = await pool.execute(`
      SELECT strftime('%m', attendance_date) as month, 
             COUNT(*) as total, 
             SUM(CASE WHEN attendance_status = 'Present' THEN 1 ELSE 0 END) as present 
      FROM attendance WHERE student_id = ?
      GROUP BY month ORDER BY month LIMIT 6
    `, [internalId]);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const areaData = {
      labels: attData.length > 0 ? attData.map(r => monthNames[parseInt(r.month) - 1] || r.month) : defaultMonths,
      data: attData.length > 0 ? attData.map(r => Math.round((r.present / r.total) * 100)) : [0, 0, 0, 0, 0, 0]
    };

    // 2. Subject Marks vs Class Average
    const [marksData] = await pool.execute(`
      SELECT su.subject_name, m.percentage as my_mark, 
             (SELECT AVG(percentage) FROM marks WHERE subject_id = su.id) as avg_mark
      FROM marks m JOIN subjects su ON m.subject_id = su.id 
      WHERE m.student_id = ? AND m.total_marks > 0
    `, [internalId]);

    const defaultSubjs = ['OS', 'DBMS', 'Networks', 'Web Dev'];
    const barData = {
      labels: marksData.length > 0 ? marksData.map(r => r.subject_name) : defaultSubjs,
      myMarks: marksData.length > 0 ? marksData.map(r => Math.round(r.my_mark)) : [0, 0, 0, 0],
      classAverage: marksData.length > 0 ? marksData.map(r => Math.round(r.avg_mark || 0)) : [0, 0, 0, 0]
    };

    // 3. Radar (Skills) - Mirror marks vs class average
    const radarData = {
      labels: barData.labels,
      mySkills: barData.myMarks,
      classAverage: barData.classAverage
    };

    // 4. Doughnut (Assignment Completion)
    // Since there is no assignment_submissions table, we can't track completion. 
    // We will return an empty chart if no data, avoiding fake data.
    const doughnutData = {
      labels: ['Completed', 'Pending', 'Overdue'],
      data: [0, 0, 0]
    };

    // Overview stats
    const [attTotal] = await pool.execute("SELECT COUNT(*) as t, SUM(CASE WHEN attendance_status='Present' THEN 1 ELSE 0 END) as p FROM attendance WHERE student_id = ?", [internalId]);
    const overallAtt = attTotal[0].t > 0 ? Math.round((attTotal[0].p / attTotal[0].t) * 100) : 0;
    
    const [markTotal] = await pool.execute("SELECT AVG(percentage / 10) as cgpa FROM marks WHERE student_id = ? AND total_marks > 0", [internalId]);
    const cgpa = markTotal[0].cgpa ? Number(markTotal[0].cgpa).toFixed(2) : 0;
    
    const [bestSubj] = await pool.execute("SELECT su.subject_name, m.percentage as p FROM marks m JOIN subjects su ON m.subject_id=su.id WHERE m.student_id = ? AND m.total_marks > 0 ORDER BY p DESC LIMIT 1", [internalId]);
    
    const overview = {
      cgpa: cgpa,
      bestSubject: bestSubj.length > 0 ? `${bestSubj[0].subject_name} (${Math.round(bestSubj[0].p)}%)` : 'None',
      attendance: overallAtt
    };

    res.json({ overview, areaData, radarData, barData, doughnutData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching student analytics' });
  }
};

module.exports = {
  getAdminAnalytics,
  getStudentAnalytics
};
