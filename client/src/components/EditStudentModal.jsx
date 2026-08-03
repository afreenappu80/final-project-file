import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';

const EditStudentModal = ({ isOpen, onClose, onSuccess, student }) => {
  const [formData, setFormData] = useState({
    student_id: '', roll_number: '', admission_number: '', department: '', branch: '',
    semester: '', full_name: '', email: '', phone: '', gender: '', subject_id: '', profile_image: null
  });
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      fetchActiveSubjects();
      setFormData({
        student_id: student.student_id || '',
        roll_number: student.roll_number || '',
        admission_number: student.admission_number || '',
        department: student.department || '',
        branch: student.branch || '',
        semester: student.semester || '',
        full_name: student.full_name || '',
        email: student.email || '',
        phone: student.phone || '',
        gender: student.gender || '',
        subject_id: student.subject_id || '',
        profile_image: null
      });
    }
  }, [isOpen, student]);

  const fetchActiveSubjects = async () => {
    setFetchingSubjects(true);
    try {
      const [subRes, deptRes] = await Promise.all([
        axios.get('/api/subjects?status=Active', { withCredentials: true }),
        axios.get('/api/departments', { withCredentials: true })
      ]);
      setSubjects(subRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      toast.error('Failed to fetch required data');
    } finally {
      setFetchingSubjects(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      await axios.put(`/api/students/${student.id}`, submitData, { 
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Student updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  const modalContent = (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative z-10 inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
              Edit Student
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Full Name *</label><input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Email Address *</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Student ID *</label><input type="text" name="student_id" required value={formData.student_id} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Roll Number *</label><input type="text" name="roll_number" required value={formData.roll_number} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Admission Number</label><input type="text" name="admission_number" value={formData.admission_number} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Mobile Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Gender *</label>
                <select name="gender" required value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Department *</label>
                <select name="department" required value={formData.department} onChange={handleChange} className={inputClass} disabled={fetchingSubjects}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.department_name}>{d.department_name}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Branch</label><input type="text" name="branch" value={formData.branch} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Semester</label><input type="number" name="semester" min="1" max="8" value={formData.semester} onChange={handleChange} className={inputClass} /></div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Assign Subject</label>
                <select name="subject_id" value={formData.subject_id} onChange={handleChange} className={inputClass} disabled={fetchingSubjects}>
                  <option value="">Select Subject</option>
                  {Array.isArray(subjects) && subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.subject_name} ({sub.subject_code})</option>
                  ))}
                </select>
                {subjects.length === 0 && !fetchingSubjects && (
                  <p className="text-red-500 text-xs mt-1">No active subjects available. Please add a subject first.</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Profile Picture (Optional)</label>
                <input type="file" name="profile_image" accept="image/jpeg, image/jpg, image/png" onChange={handleChange} className={inputClass} />
                <p className="text-xs text-gray-500 mt-1">Allowed formats: JPG, JPEG, PNG. Max size 5MB. Leave blank to keep current picture.</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditStudentModal;
