import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiEdit2, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Administrator',
    email: user?.username || 'admin@edutrack.com',
    phone: '',
    role: 'System Administrator',
    location: '',
    profile_image: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile', { withCredentials: true });
        setProfileData({
          name: data.full_name || user?.name || 'Administrator',
          email: data.email || user?.username || 'admin@edutrack.com',
          phone: data.phone || '',
          role: 'System Administrator',
          location: data.location || '',
          profile_image: data.profile_image || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      await axios.put('/api/profile', {
        full_name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        profile_image: profileData.profile_image
      }, { withCredentials: true });
      setIsEditing(false);
      toast.success('Admin Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    setUploadingImage(true);
    try {
      const { data } = await axios.post('/api/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setProfileData({ ...profileData, profile_image: data.imageUrl });
      toast.success('Image uploaded successfully! Click Save Changes to apply.');
      setIsEditing(true);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <DashboardLayout title="My Profile"><div className="p-8 text-center text-gray-500">Loading Profile...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Cover & Avatar */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition">
              <FiCamera size={20} />
            </button>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 shadow-xl flex items-center justify-center relative overflow-hidden group">
                  {profileData.profile_image ? (
                    <img src={`${profileData.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-gray-400">{profileData.name.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition" onClick={() => fileInputRef.current?.click()}>
                    <FiCamera className="text-white" size={24} />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="text-center sm:text-left pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileData.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center sm:justify-start mt-1">
                    <FiShield className="mr-2 text-blue-500" /> {profileData.role}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="mt-4 sm:mt-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center"
              >
                {isEditing ? 'Save Changes' : <><FiEdit2 className="mr-2" /> Edit Profile</>}
              </button>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg mr-4 mt-0.5">
                        <FiUser size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        {isEditing ? (
                          <input type="text" className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                        ) : (
                          <p className="font-medium text-gray-900 dark:text-white">{profileData.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg mr-4 mt-0.5">
                        <FiMail size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                        {isEditing ? (
                          <input type="email" className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                        ) : (
                          <p className="font-medium text-gray-900 dark:text-white">{profileData.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg mr-4 mt-0.5">
                        <FiPhone size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                        {isEditing ? (
                          <input type="text" className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                        ) : (
                          <p className="font-medium text-gray-900 dark:text-white">{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg mr-4 mt-0.5">
                        <FiMapPin size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        {isEditing ? (
                          <input type="text" className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} />
                        ) : (
                          <p className="font-medium text-gray-900 dark:text-white">{profileData.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
