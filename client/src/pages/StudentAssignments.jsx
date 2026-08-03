import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiUploadCloud, FiClock, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (assignmentId) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload first');
      return;
    }
    
    setUploadingId(assignmentId);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`/api/assignments/${assignmentId}/submit`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Assignment submitted successfully!');
      setSelectedFile(null);
      // Re-fetch to update status (in a real app, the API would return the submission status)
      fetchAssignments(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting assignment');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <DashboardLayout title="My Assignments">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pending Assignments</h2>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <p className="text-xl font-bold text-gray-900 dark:text-white">All caught up!</p>
            <p>You have no pending assignments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map(a => (
              <div key={a.id} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-500 dark:hover:border-blue-500 transition relative overflow-hidden group">
                <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl font-bold text-xs ${a.priority === 'High' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                  {a.priority} Priority
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 pr-20">{a.title}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{a.subject_name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">{a.description}</p>
                
                <div className="flex items-center text-sm font-bold text-red-500 mb-6 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg w-fit">
                  <FiClock className="mr-2" /> Due: {new Date(a.due_date).toLocaleDateString()}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer"
                  />
                  <button 
                    onClick={() => handleSubmit(a.id)}
                    disabled={uploadingId === a.id}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition flex items-center justify-center whitespace-nowrap"
                  >
                    {uploadingId === a.id ? 'Uploading...' : <><FiUploadCloud className="mr-2" /> Submit</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
