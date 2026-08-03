import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiBook, FiCheckCircle, FiBell, FiAward, FiClock, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          axios.get('/api/profile', { withCredentials: true }),
          axios.get('/api/dashboard/student', { withCredentials: true })
        ]);
        setProfileData(profileRes.data);
        setDashboardData(dashboardRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchDashboard();
  }, []);

  const studentInfo = {
    department: profileData?.department || 'Not Assigned',
    semester: profileData?.semester || 'N/A',
    cgpa: dashboardData?.cgpa || 'N/A',
    attendancePercent: dashboardData?.attendancePercent || 'N/A',
    rank: dashboardData?.rank || 'N/A',
    todayStatus: dashboardData?.todayStatus || 'Not Marked',
    subject_name: profileData?.subject_name || 'Not Assigned'
  };

  const upcomingAssignments = dashboardData?.upcomingAssignments || [];
  const recentMarks = dashboardData?.recentMarks || [];

  return (
    <DashboardLayout title="Student Portal">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-3xl font-bold backdrop-blur-sm overflow-hidden shadow-xl">
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.name || 'Student'}!</h2>
            <p className="text-blue-100 mb-6 text-lg">{studentInfo.department} • Semester {studentInfo.semester} • {studentInfo.subject_name}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">CGPA</p>
                <p className="text-xl font-bold">{studentInfo.cgpa}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Attendance</p>
                <p className="text-xl font-bold">{studentInfo.attendancePercent}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Rank</p>
                <p className="text-xl font-bold">#{studentInfo.rank}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Today's Status</p>
                <div className="flex items-center text-xl font-bold text-green-300">
                  <FiCheckCircle className="mr-2" /> {studentInfo.todayStatus}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Assignments */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass rounded-3xl border border-white/20 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6 border-b border-gray-100/20 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <FiFileText className="mr-2 text-blue-500" /> Upcoming Assignments
              </h3>
              <Link to="/student/assignments" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100/10">
              {upcomingAssignments.length === 0 && <p className="p-6 text-gray-500 text-center font-medium">No upcoming assignments.</p>}
              {upcomingAssignments.map(task => (
                <div key={task.id} className="p-6 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <FiClock size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.subject_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                    <button className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Submit Now</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Marks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass rounded-3xl border border-white/20 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6 border-b border-gray-100/20 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <FiAward className="mr-2 text-purple-500" /> Recent Marks
              </h3>
              <Link to="/student/marks" className="text-sm text-blue-600 hover:underline">View Progress</Link>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentMarks.map(mark => (
                  <div key={mark.id} className="p-5 border border-white/20 bg-white/20 dark:bg-gray-800/30 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{mark.subject_name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Exam</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{mark.marks_obtained}/{mark.total_marks}</p>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Score</span>
                    </div>
                  </div>
                ))}
                {recentMarks.length === 0 && <p className="text-gray-500 text-center w-full col-span-2 font-medium">No recent marks found.</p>}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Latest Notifications */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass rounded-3xl border border-white/20 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6 border-b border-gray-100/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <FiBell className="mr-2 text-yellow-500" /> Notifications
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">DBMS marks published</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Urgent: Submit OS Assignment</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Library fee due next week</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="glass rounded-3xl border border-white/20 p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/student/attendance" className="p-5 bg-white/30 dark:bg-gray-800/40 rounded-2xl text-center hover:bg-white/50 dark:hover:bg-gray-700/60 hover:-translate-y-1 transition-all duration-300 group shadow-sm">
                <FiCheckCircle className="mx-auto text-indigo-400 group-hover:text-indigo-600 group-hover:scale-110 transition-transform mb-3" size={28} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Attendance</span>
              </Link>
              <Link to="/student/profile" className="p-5 bg-white/30 dark:bg-gray-800/40 rounded-2xl text-center hover:bg-white/50 dark:hover:bg-gray-700/60 hover:-translate-y-1 transition-all duration-300 group shadow-sm">
                <FiBook className="mx-auto text-purple-400 group-hover:text-purple-600 group-hover:scale-110 transition-transform mb-3" size={28} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">My Profile</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
