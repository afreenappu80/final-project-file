import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUser, FiLogOut, FiMenu, FiX, FiCheckSquare, FiBarChart2, FiBook, FiFileText, FiBell, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', path: '/admin', icon: FiHome },
        { name: 'Students', path: '/admin/students', icon: FiUser },
        { name: 'Departments', path: '/admin/departments', icon: FiUser }, // Or use a different icon like FiList if imported
        { name: 'Subjects', path: '/admin/subjects', icon: FiBook },
        { name: 'Attendance', path: '/admin/attendance', icon: FiCheckSquare },
        { name: 'Assignments', path: '/admin/assignments', icon: FiFileText },
        { name: 'Marks', path: '/admin/marks', icon: FiBarChart2 },
        { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
        { name: 'Reports', path: '/admin/reports', icon: FiFileText },
        { name: 'Notifications', path: '/admin/notifications', icon: FiBell },
        { name: 'Profile', path: '/admin/profile', icon: FiUser },
        { name: 'Settings', path: '/admin/settings', icon: FiSettings },
      ]
    : [
        { name: 'Dashboard', path: '/student', icon: FiHome },
        { name: 'Attendance', path: '/student/attendance', icon: FiCheckSquare },
        { name: 'Marks', path: '/student/marks', icon: FiBarChart2 },
        { name: 'Assignments', path: '/student/assignments', icon: FiFileText },
        { name: 'Analytics', path: '/student/analytics', icon: FiBarChart2 },
        { name: 'Notifications', path: '/student/notifications', icon: FiBell },
        { name: 'Profile', path: '/student/profile', icon: FiUser },
        { name: 'Settings', path: '/student/settings', icon: FiSettings },
      ];

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Sidebar - Floating Glass */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 glass shadow-xl m-4 rounded-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-200/30 dark:border-gray-700/30 flex-shrink-0">
          <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight">EduTrack 2.0</span>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-indigo-500 text-white shadow-md glow-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-800/40 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <item.icon className={`mr-3 flex-shrink-0 ${location.pathname === item.path ? 'text-white' : ''}`} size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-8"
          >
            <FiLogOut className="mr-3 flex-shrink-0" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Glass */}
        <header className="glass shadow-sm z-20 m-4 mb-0 rounded-2xl">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none lg:hidden mr-4"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                  {user?.name || user?.username}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
