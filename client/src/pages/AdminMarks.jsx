import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';

const AdminMarks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(false);
  const [marksData, setMarksData] = useState({});

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

  const fetchStudentsAndMarks = async () => {
    if (!selectedSubject || !semester) {
      toast.warn('Please select subject and semester');
      return;
    }
    setLoading(true);
    try {
      const stdRes = await axios.get('/api/students?limit=1000', { withCredentials: true });
      const marksRes = await axios.get(`/api/marks?semester=${semester}`, { withCredentials: true });
      
      setStudents(stdRes.data.students.filter(s => s.status === 'Active'));
      
      const newMarksData = {};
      marksRes.data.forEach(m => {
        if(m.subject_id === parseInt(selectedSubject)) {
          newMarksData[m.student_id] = {
            internal_marks: m.internal_marks,
            external_marks: m.external_marks,
            assignment_marks: m.assignment_marks,
            lab_marks: m.lab_marks,
            project_marks: m.project_marks
          };
        }
      });
      setMarksData(newMarksData);
    } catch (error) {
      toast.error('Failed to fetch marks data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const saveMarks = async () => {
    setLoading(true);
    try {
      const promises = Object.keys(marksData).map(studentId => {
        const d = marksData[studentId];
        if (!d.internal_marks && !d.external_marks && !d.assignment_marks && !d.lab_marks && !d.project_marks) return Promise.resolve();
        
        return axios.post('/api/marks', {
          student_id: studentId,
          subject_id: selectedSubject,
          semester: semester,
          internal_marks: d.internal_marks || 0,
          external_marks: d.external_marks || 0,
          assignment_marks: d.assignment_marks || 0,
          lab_marks: d.lab_marks || 0,
          project_marks: d.project_marks || 0
        }, { withCredentials: true });
      });

      await Promise.all(promises);
      toast.success('Marks saved successfully');
      fetchStudentsAndMarks(); // refresh to show totals/grades (or we could calculate locally)
    } catch (error) {
      toast.error('Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <DashboardLayout title="Performance Management">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
            <input type="number" min="1" max="8" value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={subjects.length === 0} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{subjects.length === 0 ? "No subjects found. Add one first." : "Select Subject..."}</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
            </select>
          </div>
          <div>
            <button onClick={fetchStudentsAndMarks} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Fetch List
            </button>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white">Enter Marks</h3>
            <button onClick={saveMarks} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 disabled:opacity-50">
              <FiSave className="mr-2" /> Save Marks
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Roll No</th>
                  <th className="px-4 py-3 font-medium text-center">Internal (20)</th>
                  <th className="px-4 py-3 font-medium text-center">External (50)</th>
                  <th className="px-4 py-3 font-medium text-center">Assign (10)</th>
                  <th className="px-4 py-3 font-medium text-center">Lab (10)</th>
                  <th className="px-4 py-3 font-medium text-center">Project (10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{student.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student.roll_number}</td>
                    <td className="px-4 py-3 text-center"><input type="number" className={inputClass} value={marksData[student.id]?.internal_marks || ''} onChange={e => handleMarkChange(student.id, 'internal_marks', e.target.value)} /></td>
                    <td className="px-4 py-3 text-center"><input type="number" className={inputClass} value={marksData[student.id]?.external_marks || ''} onChange={e => handleMarkChange(student.id, 'external_marks', e.target.value)} /></td>
                    <td className="px-4 py-3 text-center"><input type="number" className={inputClass} value={marksData[student.id]?.assignment_marks || ''} onChange={e => handleMarkChange(student.id, 'assignment_marks', e.target.value)} /></td>
                    <td className="px-4 py-3 text-center"><input type="number" className={inputClass} value={marksData[student.id]?.lab_marks || ''} onChange={e => handleMarkChange(student.id, 'lab_marks', e.target.value)} /></td>
                    <td className="px-4 py-3 text-center"><input type="number" className={inputClass} value={marksData[student.id]?.project_marks || ''} onChange={e => handleMarkChange(student.id, 'project_marks', e.target.value)} /></td>
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

export default AdminMarks;
