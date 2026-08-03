import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const { data } = await axios.get('/api/marks', { withCredentials: true });
      setMarks(data);
    } catch (error) {
      toast.error('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  // Calculate CGPA strictly based on percentage for now
  let totalPct = 0;
  marks.forEach(m => totalPct += parseFloat(m.percentage));
  const avgPct = marks.length > 0 ? (totalPct / marks.length).toFixed(1) : 0;
  const cgpa = marks.length > 0 ? (avgPct / 10).toFixed(2) : 0.00;

  return (
    <DashboardLayout title="My Performance">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Estimated CGPA</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">{cgpa}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Overall Percentage</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{avgPct}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Semester</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium text-center">Internal</th>
                <th className="px-6 py-4 font-medium text-center">External</th>
                <th className="px-6 py-4 font-medium text-center">Total</th>
                <th className="px-6 py-4 font-medium text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : marks.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No marks found.</td></tr>
              ) : (
                marks.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Sem {record.semester}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      <div>{record.subject_name}</div>
                      <div className="text-xs">{record.subject_code}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white">{record.internal_marks}/20</td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white">{record.external_marks}/50</td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-semibold">{record.total_marks}/100</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {record.grade}
                      </span>
                    </td>
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

export default StudentMarks;
