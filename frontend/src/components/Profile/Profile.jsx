import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateProfile } from "../../store/UserReducers";
import { useTheme } from "../../contexts/ThemeContext";
import { FiUser, FiPhone, FiMapPin, FiBriefcase, FiEdit2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avator: "",
    role: "",
    session_id: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        avator: user.avator || "",
        role: user.role || "",
        session_id: user.session_id || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("role", formData.role);
      form.append("session_id", formData.session_id);
      if (avatarFile) {
        form.append("file", avatarFile);
      }
      // If not uploading a new avatar, send current avatar url as a field
      if (!avatarFile && formData.avator) {
        form.append("avatar", formData.avator);
      }
      const { data } = await axios.patch(
        "http://localhost:4000/auth/update",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(updateProfile(data.user));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      avator: user.avator || "",
      role: user.role || "",
      session_id: user.session_id || ""
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please login to view profile</h2>
        </div>
      </section>
    );
  }

  // ...existing code...
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-800 py-16 px-2 animate-fade-in">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 w-full">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center md:w-1/3 w-full pt-8 animate-fade-in-up">
            <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-blue-600 shadow-xl mb-4 bg-gray-100 dark:bg-gray-700 flex items-center justify-center group">
              {formData.avator ? (
                <img src={formData.avator} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-28 h-28 text-blue-600 bg-white" />
              )}
              {isEditing && (
                <>
                  <label htmlFor="avatar-upload" className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg cursor-pointer flex items-center justify-center transition group-hover:scale-110">
                    <FiEdit2 className="w-5 h-5" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0]);
                        setCropModalOpen(true);
                      }
                    }}
                  />
                </>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{formData.name || "User"}</h2>
            <p className="text-blue-600 dark:text-blue-300 font-medium mb-2 text-lg">{formData.role === "employer" ? "Employer" : "Job Seeker"}</p>
          </div>
          {/* Profile Form Section */}
          <div className="flex-1 w-full pt-8 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-transparent px-1 pointer-events-none">
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-transparent px-1 pointer-events-none">
                      Phone
                    </label>
                  </div>
                </div>
                <div className="space-y-8">
                  {formData.role === "employer" ? (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                          placeholder=" "
                        />
                        <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-transparent px-1 pointer-events-none">
                          Company Name
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                          placeholder=" "
                        />
                        <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-transparent px-1 pointer-events-none">
                          Website
                        </label>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md animate-bounce-in"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md animate-bounce-in"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Avatar Crop Modal */}
        {cropModalOpen && avatarFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl w-full max-w-lg flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Crop Avatar</h3>
              <div className="relative w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Cropper
                  image={URL.createObjectURL(avatarFile)}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={async () => {
                    const croppedImg = await getCroppedImg(URL.createObjectURL(avatarFile), croppedAreaPixels);
                    setFormData(prev => ({ ...prev, avator: croppedImg }));
                    setCropModalOpen(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  onClick={() => {
                    setAvatarFile(null);
                    setCropModalOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default Profile;

