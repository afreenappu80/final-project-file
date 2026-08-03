import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { FiSearch, FiSave } from 'react-icons/fi';

const AdminAttendance = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get('/api/subjects', { withCredentials: true });
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchStudentsAndAttendance = async () => {
    if (!selectedSubject || !attendanceDate) {
      toast.warn('Please select subject and date');
      return;
    }
    setLoading(true);
    try {
      // For simplicity in Phase 2, we fetch all active students and map existing attendance
      const stdRes = await axios.get('/api/students?limit=1000', { withCredentials: true });
      const attRes = await axios.get(`/api/attendance?subject_id=${selectedSubject}&start_date=${attendanceDate}&end_date=${attendanceDate}`, { withCredentials: true });
      
      setStudents(stdRes.data.students.filter(s => s.status === 'Active'));
      
      const newAttData = {};
      attRes.data.forEach(a => {
        newAttData[a.student_id] = { status: a.attendance_status, remarks: a.remarks };
      });
      setAttendanceData(newAttData);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      const promises = Object.keys(attendanceData).map(studentId => {
        if (!attendanceData[studentId].status) return Promise.resolve();
        return axios.post('/api/attendance', {
          student_id: studentId,
          subject_id: selectedSubject,
          attendance_date: attendanceDate,
          attendance_status: attendanceData[studentId].status,
          remarks: attendanceData[studentId].remarks || ''
        }, { withCredentials: true });
      });

      await Promise.all(promises);
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save some attendance records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Attendance Management">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Subject...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <button onClick={fetchStudentsAndAttendance} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Fetch Students
            </button>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white">Mark Attendance</h3>
            <button onClick={saveAttendance} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 disabled:opacity-50">
              <FiSave className="mr-2" /> Save All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Roll No</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{student.full_name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.roll_number}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        {['Present', 'Absent', 'Late', 'Half Day', 'Leave'].map(status => (
                          <button 
                            key={status}
                            onClick={() => handleStatusChange(student.id, status)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                              attendanceData[student.id]?.status === status 
                                ? status === 'Absent' ? 'bg-red-500 text-white' 
                                  : status === 'Present' ? 'bg-green-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminAttendance;
