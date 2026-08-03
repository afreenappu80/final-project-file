import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlus, FiEdit2, FiSearch, FiMoreVertical } from 'react-icons/fi';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newSub, setNewSub] = useState({ subject_code: '', subject_name: '', department: '', semester: '', credits: '', faculty_name: '', status: 'Active' });
  const [editSub, setEditSub] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, deptRes] = await Promise.all([
        axios.get('/api/subjects', { withCredentials: true }),
        axios.get('/api/departments', { withCredentials: true })
      ]);
      setSubjects(subRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/subjects', newSub, { withCredentials: true });
      toast.success('Subject added');
      setNewSub({ subject_code: '', subject_name: '', department: '', semester: '', credits: '', faculty_name: '', status: 'Active' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/subjects/${editSub.id}`, editSub, { withCredentials: true });
      toast.success('Subject updated');
      setEditSub(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subject?')) {
      try {
        await axios.delete(`/api/subjects/${id}`, { withCredentials: true });
        toast.success('Subject deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete subject');
      }
    }
  };

  const toggleStatus = async (subject) => {
    const newStatus = subject.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`/api/subjects/${subject.id}`, { ...subject, status: newStatus }, { withCredentials: true });
      toast.success(`Subject marked as ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.subject_name.toLowerCase().includes(search.toLowerCase()) || 
    s.subject_code.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <DashboardLayout title="Subject Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {editSub ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">Edit Subject</h3>
                <button onClick={() => setEditSub(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
              </div>
              <form onSubmit={handleEdit} className="space-y-4">
                <div><label className={labelClass}>Code</label><input type="text" value={editSub.subject_code} onChange={e => setEditSub({...editSub, subject_code: e.target.value})} required className={inputClass} /></div>
                <div><label className={labelClass}>Name</label><input type="text" value={editSub.subject_name} onChange={e => setEditSub({...editSub, subject_name: e.target.value})} required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Department</label>
                  <select value={editSub.department} onChange={e => setEditSub({...editSub, department: e.target.value})} required disabled={departments.length === 0} className={inputClass}>
                    <option value="">{departments.length === 0 ? "No departments available" : "Select Dept"}</option>
                    {departments.map(d => <option key={d.id} value={d.department_name}>{d.department_name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Semester</label><input type="number" min="1" value={editSub.semester} onChange={e => setEditSub({...editSub, semester: e.target.value})} required className={inputClass} /></div>
                  <div><label className={labelClass}>Credits</label><input type="number" min="1" value={editSub.credits} onChange={e => setEditSub({...editSub, credits: e.target.value})} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Faculty Name</label><input type="text" value={editSub.faculty_name || ''} onChange={e => setEditSub({...editSub, faculty_name: e.target.value})} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={editSub.status || 'Active'} onChange={e => setEditSub({...editSub, status: e.target.value})} required className={inputClass}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <button type="submit" className="w-full flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <FiEdit2 className="mr-2" /> Update Subject
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Subject</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><label className={labelClass}>Code</label><input type="text" value={newSub.subject_code} onChange={e => setNewSub({...newSub, subject_code: e.target.value})} required className={inputClass} /></div>
                <div><label className={labelClass}>Name</label><input type="text" value={newSub.subject_name} onChange={e => setNewSub({...newSub, subject_name: e.target.value})} required className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Department</label>
                  <select value={newSub.department} onChange={e => setNewSub({...newSub, department: e.target.value})} required disabled={departments.length === 0} className={inputClass}>
                    <option value="">{departments.length === 0 ? "No departments available" : "Select Dept"}</option>
                    {departments.map(d => <option key={d.id} value={d.department_name}>{d.department_name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Semester</label><input type="number" min="1" value={newSub.semester} onChange={e => setNewSub({...newSub, semester: e.target.value})} required className={inputClass} /></div>
                  <div><label className={labelClass}>Credits</label><input type="number" min="1" value={newSub.credits} onChange={e => setNewSub({...newSub, credits: e.target.value})} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Faculty Name</label><input type="text" value={newSub.faculty_name} onChange={e => setNewSub({...newSub, faculty_name: e.target.value})} className={inputClass} /></div>
                
                <button type="submit" className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <FiPlus className="mr-2" /> Add Subject
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search subjects by name or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Dept/Sem</th>
                    <th className="px-6 py-4 font-medium">Credits</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                  ) : filteredSubjects.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No subjects found.</td></tr>
                  ) : (
                    filteredSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{sub.subject_name}</div>
                          <div className="text-xs text-gray-500">{sub.subject_code}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{sub.department} - S{sub.semester}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{sub.credits}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => toggleStatus(sub)} className="text-gray-500 hover:text-blue-600 p-1" title="Toggle Status">
                              <FiMoreVertical size={18} />
                            </button>
                            <button onClick={() => setEditSub(sub)} className="text-gray-500 hover:text-green-600 p-1" title="Edit">
                              <FiEdit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(sub.id)} className="text-gray-500 hover:text-red-600 p-1" title="Delete">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubjects;

