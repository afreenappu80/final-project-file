import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { FiSearch, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import AddStudentModal from '../components/AddStudentModal';
import EditStudentModal from '../components/EditStudentModal';

const AdminStudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/students?page=${page}&limit=10&search=${search}`, { withCredentials: true });
      setStudents(data.students);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 500); // debounce search
    
    return () => clearTimeout(timeoutId);
  }, [page, search]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.patch(`/api/students/${id}/status`, { status: newStatus }, { withCredentials: true });
      toast.success(`Student marked as ${newStatus}`);
      setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to soft-delete this student?')) {
      try {
        await axios.delete(`/api/students/${id}`, { withCredentials: true });
        toast.success('Student deleted');
        setStudents(students.map(s => s.id === id ? { ...s, status: 'Inactive' } : s)); // Reflect soft delete
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  return (
    <DashboardLayout title="Student Management">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => {setSearch(e.target.value); setPage(1);}}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button type="button" onClick={() => { console.log('Add Student button clicked!'); setIsModalOpen(true); }} className="relative z-50 pointer-events-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium transition-colors w-full sm:w-auto">
            Add New Student
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Roll No</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No students found.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {student.profile_image ? (
                          <img src={`${student.profile_image}`} alt={student.full_name} className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold mr-3">
                            {student.full_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{student.full_name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{student.roll_number}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{student.department} <span className="text-xs">({student.semester} Sem)</span></td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                      {student.subject_name || <span className="text-gray-400 italic">Not Assigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => toggleStatus(student.id, student.status)} className="text-gray-500 hover:text-blue-600 p-1" title="Toggle Status">
                          <FiMoreVertical size={18} />
                        </button>
                        <button onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); }} className="text-gray-500 hover:text-green-600 p-1" title="Edit">
                          <FiEdit2 size={18} />
                        </button>
                        <button onClick={() => deleteStudent(student.id)} className="text-gray-500 hover:text-red-600 p-1" title="Delete">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
      </div>
      <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchStudents} />
      <EditStudentModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedStudent(null); }} onSuccess={fetchStudents} student={selectedStudent} />
    </DashboardLayout>
  );
};

export default AdminStudentManagement;
