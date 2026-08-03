import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiBell, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications', { withCredentials: true });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <DashboardLayout title="My Notifications">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiBell className="mr-3 text-blue-500" /> Notifications Feed
          </h2>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiCheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-xl font-bold text-gray-900 dark:text-white">All caught up!</p>
            <p>No new notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className={`p-6 rounded-2xl border ${!n.is_read ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800' : 'border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700'} flex items-start space-x-4 transition-colors`}>
                <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{n.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
