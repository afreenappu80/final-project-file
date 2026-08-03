import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDept, setNewDept] = useState({ department_name: '', hod_name: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('/api/departments', { withCredentials: true });
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/departments', newDept, { withCredentials: true });
      toast.success('Department added');
      setNewDept({ department_name: '', hod_name: '' });
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department?')) {
      try {
        await axios.delete(`/api/departments/${id}`, { withCredentials: true });
        toast.success('Department deleted');
        fetchDepartments();
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  return (
    <DashboardLayout title="Department Management">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Department</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDept.department_name}
                  onChange={(e) => setNewDept({ ...newDept, department_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HOD Name</label>
                <input
                  type="text"
                  value={newDept.hod_name}
                  onChange={(e) => setNewDept({ ...newDept, hod_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button type="submit" className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <FiPlus className="mr-2" /> Add Department
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Department Name</th>
                  <th className="px-6 py-4 font-medium">HOD Name</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : departments.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No departments found.</td></tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{dept.department_name}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{dept.hod_name || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700 p-1">
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDepartments;
