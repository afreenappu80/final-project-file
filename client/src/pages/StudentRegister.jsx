import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const StudentRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/register', data);
      toast.success('Registration Successful!');
      setTimeout(() => {
        navigate('/student-login');
      }, 2000);
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl p-8 glass rounded-2xl shadow-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Student Registration</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Create your account to access the portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Academic Details Section */}
            <div>
              <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 dark:text-white">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Student ID *</label>
                  <input type="text" {...register('student_id', { required: 'Required' })} className={inputClass} />
                  {errors.student_id && <p className={errorClass}>{errors.student_id.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Roll Number *</label>
                  <input type="text" {...register('roll_number', { required: 'Required' })} className={inputClass} />
                  {errors.roll_number && <p className={errorClass}>{errors.roll_number.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Admission Number *</label>
                  <input type="text" {...register('admission_number', { required: 'Required' })} className={inputClass} />
                  {errors.admission_number && <p className={errorClass}>{errors.admission_number.message}</p>}
                </div>
                
                <div>
                  <label className={labelClass}>Department *</label>
                  <select {...register('department', { required: 'Required' })} className={inputClass}>
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                  {errors.department && <p className={errorClass}>{errors.department.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Branch *</label>
                  <input type="text" {...register('branch', { required: 'Required' })} className={inputClass} />
                  {errors.branch && <p className={errorClass}>{errors.branch.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Semester *</label>
                  <input type="number" {...register('semester', { required: 'Required', min: 1, max: 8 })} className={inputClass} />
                  {errors.semester && <p className={errorClass}>{errors.semester.message}</p>}
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div>
              <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 dark:text-white">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" {...register('full_name', { required: 'Required' })} className={inputClass} />
                  {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" {...register('email', { 
                    required: 'Required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })} className={inputClass} />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input type="tel" {...register('phone', { required: 'Required' })} className={inputClass} />
                  {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select {...register('gender', { required: 'Required' })} className={inputClass}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 dark:text-white">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Password *</label>
                  <input 
                    type="password" 
                    {...register('password', { 
                      required: 'Required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: 'Must include uppercase, lowercase, number, special char'
                      }
                    })} 
                    className={inputClass} 
                  />
                  {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <input 
                    type="password" 
                    {...register('confirmPassword', { 
                      required: 'Required',
                      validate: value => value === password || "Passwords do not match"
                    })} 
                    className={inputClass} 
                  />
                  {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Account'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/student-login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegister;
