import { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiMoon, FiSun, FiBell, FiShield, FiGlobe, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StudentSettings = () => {
  const [theme, setTheme] = useState(localStorage.theme === 'dark' ? 'dark' : 'light');
  const [notifications, setNotifications] = useState({
    assignmentAlerts: true,
    attendanceAlerts: true,
    marksPublished: true
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, { withCredentials: true });
      
      toast.success('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mr-4">
              <FiSun size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
              <p className="text-gray-500 text-sm">Customize how your dashboard looks.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch between light and dark themes</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : ''}`}>
                {theme === 'dark' ? <FiMoon size={12} className="text-blue-600" /> : <FiSun size={12} className="text-yellow-500" />}
              </div>
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 mr-4">
              <FiLock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Password</h2>
              <p className="text-gray-500 text-sm">Manage your account security.</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input type="password" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" required minLength={6} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" required minLength={6} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm">
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mr-4">
              <FiBell size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-gray-500 text-sm">Choose what we notify you about.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Assignment Alerts</p>
                <p className="text-sm text-gray-500">Notify me when new assignments are posted</p>
              </div>
              <input type="checkbox" checked={notifications.assignmentAlerts} onChange={(e) => setNotifications({...notifications, assignmentAlerts: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Attendance Warnings</p>
                <p className="text-sm text-gray-500">Notify me if my attendance drops below 75%</p>
              </div>
              <input type="checkbox" checked={notifications.attendanceAlerts} onChange={(e) => setNotifications({...notifications, attendanceAlerts: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Marks Published</p>
                <p className="text-sm text-gray-500">Notify me when exam results are out</p>
              </div>
              <input type="checkbox" checked={notifications.marksPublished} onChange={(e) => setNotifications({...notifications, marksPublished: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
