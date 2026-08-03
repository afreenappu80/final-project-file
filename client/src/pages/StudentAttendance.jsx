import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      // Backend automatically filters for the logged-in student
      const { data } = await axios.get('/api/attendance', { withCredentials: true });
      setAttendance(data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentage
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => ['Present', 'Late', 'Half Day'].includes(a.attendance_status)).length;
  const percentage = totalClasses === 0 ? 0 : ((presentClasses / totalClasses) * 100).toFixed(1);

  return (
    <DashboardLayout title="My Attendance">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Overall Attendance</h3>
          <p className={`text-3xl font-bold mt-2 ${percentage < 75 ? 'text-red-500' : 'text-green-500'}`}>
            {percentage}%
          </p>
          {percentage < 75 && totalClasses > 0 && (
            <p className="text-xs text-red-500 mt-2 font-medium">Warning: Attendance is below 75% requirement.</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Classes Held</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{totalClasses}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Classes Attended</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{presentClasses}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No attendance records found.</td></tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {new Date(record.attendance_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{record.subject_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.attendance_status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.attendance_status === 'Absent' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.attendance_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{record.remarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
