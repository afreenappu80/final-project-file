import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiPlus, FiTrash2, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newAssignment, setNewAssignment] = useState({
    title: '', description: '', due_date: '', priority: 'Medium', subject_id: ''
  });

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('/api/assignments', { withCredentials: true });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('/api/subjects', { withCredentials: true });
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/assignments', newAssignment, { withCredentials: true });
      toast.success('Assignment created successfully');
      setNewAssignment({ title: '', description: '', due_date: '', priority: 'Medium', subject_id: '' });
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`/api/assignments/${id}`, { withCredentials: true });
      toast.success('Assignment deleted');
      fetchAssignments();
    } catch (err) {
      toast.error('Error deleting assignment');
    }
  };

  return (
    <DashboardLayout title="Assignment Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Assignment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <FiPlus className="mr-2 text-blue-500" /> Create New Assignment
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <select required className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" value={newAssignment.subject_id} onChange={e => setNewAssignment({...newAssignment, subject_id: e.target.value})}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" required className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea required rows="3" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input type="date" required className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" value={newAssignment.due_date} onChange={e => setNewAssignment({...newAssignment, due_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" value={newAssignment.priority} onChange={e => setNewAssignment({...newAssignment, priority: e.target.value})}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md">
                Publish Assignment
              </button>
            </form>
          </div>
        </div>

        {/* Assignments List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Assignments</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No assignments created yet.</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {assignments.map(a => (
                  <div key={a.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${a.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : a.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                          {a.priority}
                        </span>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{a.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{a.description}</p>
                      <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                        <span>Subject: {a.subject_name}</span>
                        <span className="text-red-500">Due: {new Date(a.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg transition flex items-center">
                        <FiDownload className="mr-2" /> Submissions
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminAssignments;
