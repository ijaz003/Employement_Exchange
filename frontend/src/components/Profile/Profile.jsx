import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAxios from "../../hooks/useAxios";
import { updateProfile } from "../../store/UserReducers";
import { FiUser, FiEdit2, FiSave, FiX } from "react-icons/fi";

// Modern color scheme (tailwind)
const COLORS = {
  primary: "bg-blue-600 hover:bg-blue-700",
  accent: "bg-blue-100 text-blue-700",
  border: "border-gray-300 dark:border-gray-600",
  input: "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  card: "bg-white dark:bg-gray-800 shadow-xl rounded-2xl",
  error: "text-red-500",
  success: "text-green-600",
  text: "text-gray-900 dark:text-white",
  label: "text-blue-700 dark:text-blue-300",
};

const ProfileUpdate = () => {
  const axios = useAxios();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone ? String(user.phone) : "",
      });
          // Always use image from Redux user state
          setAvatar(user.avatar || user.avator || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQADjfoADAlJPrsl_hiiOMeE-FBor-i6hEAVg&s");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      if (file) data.append("file", file);
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (!file && avatar) data.append("avatar", avatar); // Send existing avatar if no new file

      const res = await axios.patch("/auth/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(updateProfile(res.data.user));
      setMessage("Profile updated successfully!");
      if (res.data.user && res.data.user.avatar) {
        setAvatar(res.data.user.avatar);
      }
      setPreview(null);
      setFile(null);
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone ? String(user.phone) : "",
    });
    setFile(null);
    setPreview(null);
    setIsEditing(false);
    setMessage("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-gray-900">
        <div className={`${COLORS.card} p-8 text-center`}>
          <h2 className={`text-2xl font-bold ${COLORS.text} mb-4`}>
            Please login to view profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-gray-900 p-6">
      <div className={`w-full max-w-lg ${COLORS.card} p-8 animate-fade-in-up`}>
        <h2 className={`text-3xl font-extrabold ${COLORS.label} mb-8 text-center tracking-tight`}>
          Your Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div className={`relative w-32 h-32 rounded-full overflow-hidden ${COLORS.border} border-4 shadow-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700`}>
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : avatar ? (
              <img src={user?.avatar || user?.avator || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQADjfoADAlJPrsl_hiiOMeE-FBor-i6hEAVg&s"} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-16 h-16 text-blue-600 dark:text-blue-300" />
            )}
            {isEditing && (
              <>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow-md hover:scale-110 transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
          <p className={`mt-4 text-lg font-semibold ${COLORS.text}`}>
            {formData.name || "User"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${COLORS.label} mb-1`}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${COLORS.border} rounded-xl ${COLORS.input} bg-blue-50 dark:bg-gray-700 ${COLORS.text} disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all`}
                autoComplete="name"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className={`block text-sm font-medium ${COLORS.label} mb-1`}>
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${COLORS.border} rounded-xl ${COLORS.input} bg-blue-50 dark:bg-gray-700 ${COLORS.text} disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all`}
                autoComplete="tel"
              />
            </div>

            {/* Role removed as requested */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-6 py-2 border ${COLORS.border} ${COLORS.text} rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <FiX className="inline mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 ${COLORS.primary} text-white rounded-xl font-semibold shadow-md transition disabled:opacity-50 flex items-center space-x-2`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={`px-6 py-2 ${COLORS.primary} text-white rounded-xl font-semibold shadow-md transition flex items-center space-x-2`}
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className={`text-center text-sm mt-6 ${message.includes("success") ? COLORS.success : COLORS.error}`}>
            {message}
          </p>
        )}
      </div>

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileUpdate;