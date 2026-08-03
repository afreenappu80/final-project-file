import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiBook, FiCheckSquare, FiUserCheck, FiUserX, 
  FiPercent, FiBarChart2, FiAward, FiStar, FiClock,
  FiPlus, FiEdit, FiTrash2, FiSearch, FiFileText
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    todayAttendance: '0%',
    presentStudents: 0,
    absentStudents: 0,
    averageAttendance: '0%',
    averageMarks: 'N/A',
    passPercentage: 'N/A',
    topPerformer: 'N/A'
  });

  const [activities, setActivities] = useState([
    { id: 1, action: 'System started', created_at: new Date().toISOString() }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/dashboard/admin', { withCredentials: true });
        setStats({
          totalStudents: data.totalStudents,
          totalSubjects: data.totalSubjects,
          todayAttendance: data.todayAttendance,
          presentStudents: data.presentStudents,
          absentStudents: data.absentStudents,
          averageAttendance: data.averageAttendance,
          averageMarks: data.averageMarks,
          passPercentage: data.passPercentage,
          topPerformer: data.topPerformer
        });
        if (data.recentActivities) {
          setActivities(data.recentActivities);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, delay = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass p-6 rounded-3xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group flex items-center space-x-5 relative overflow-hidden cursor-pointer"
    >
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 transition-transform duration-700 group-hover:scale-[2.5] ${color}`} />
      <div className={`p-4 rounded-2xl ${color} bg-opacity-20 dark:bg-opacity-20 backdrop-blur-sm border border-white/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all`}>
        <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="z-10">
        <h3 className="text-gray-600 dark:text-gray-300 text-xs font-bold tracking-widest uppercase">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 tracking-tight">{value}</p>
      </div>
    </motion.div>
  );

  const QuickAction = ({ icon: Icon, title, path, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link to={path} className="glass flex flex-col items-center justify-center p-5 rounded-3xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
        <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 mb-4 group-hover:scale-110 group-hover:bg-${color}-500 group-hover:text-white transition-all duration-300 border border-${color}-500/20`}>
          <Icon size={26} />
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 text-center">{title}</span>
      </Link>
    </motion.div>
  );

  return (
    <DashboardLayout title="Overview Dashboard">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiUsers} title="Total Students" value={stats.totalStudents} color="bg-blue-500" delay={0.1} />
        <StatCard icon={FiBook} title="Total Subjects" value={stats.totalSubjects} color="bg-purple-500" delay={0.15} />
        <StatCard icon={FiCheckSquare} title="Today's Attendance" value={stats.todayAttendance} color="bg-indigo-500" delay={0.2} />
        <StatCard icon={FiUserCheck} title="Present Students" value={stats.presentStudents} color="bg-green-500" delay={0.25} />
        <StatCard icon={FiUserX} title="Absent Students" value={stats.absentStudents} color="bg-red-500" delay={0.3} />
        <StatCard icon={FiPercent} title="Average Attendance" value={stats.averageAttendance} color="bg-teal-500" delay={0.35} />
        <StatCard icon={FiBarChart2} title="Average Marks" value={stats.averageMarks} color="bg-orange-500" delay={0.4} />
        <StatCard icon={FiAward} title="Pass Percentage" value={stats.passPercentage} color="bg-emerald-500" delay={0.45} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiPlus className="mr-2" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <QuickAction icon={FiPlus} title="Add Student" path="/admin/students" color="blue" delay={0.5} />
            <QuickAction icon={FiEdit} title="Edit Student" path="/admin/students" color="green" delay={0.55} />
            <QuickAction icon={FiTrash2} title="Delete Student" path="/admin/students" color="red" delay={0.6} />
            <QuickAction icon={FiSearch} title="Search" path="/admin/students" color="purple" delay={0.65} />
            <QuickAction icon={FiCheckSquare} title="Attendance" path="/admin/attendance" color="indigo" delay={0.7} />
            <QuickAction icon={FiBarChart2} title="Add Marks" path="/admin/marks" color="orange" delay={0.75} />
            <QuickAction icon={FiFileText} title="Assignments" path="/admin/assignments" color="pink" delay={0.8} />
            <QuickAction icon={FiFileText} title="Reports" path="/admin/reports" color="teal" delay={0.85} />
          </div>
        </div>

        {/* Recent Activities */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="xl:col-span-1"
        >
          <div className="glass rounded-3xl p-6 h-full border border-white/20">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
              <FiClock className="mr-3 text-indigo-500" /> Recent Activities
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/30 before:to-transparent">
              {activities.map(activity => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-50 dark:bg-indigo-900/50 text-indigo-500 group-[.is-active]:bg-indigo-500 group-[.is-active]:text-indigo-50 group-[.is-active]:glow-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-500">
                    <FiClock size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
