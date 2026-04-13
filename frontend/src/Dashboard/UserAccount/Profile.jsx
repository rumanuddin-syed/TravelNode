import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import { FiUpload, FiUser, FiMail, FiLoader } from "react-icons/fi";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";

const Profile = () => {
  const { user, token, dispatch } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    photo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, photo: data.url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/user/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...formData };
        dispatch({
          type: "UPDATE_USER",
          payload: updatedUser
        });
        
        toast.success(result.message || "Profile updated successfully");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-display-sm text-text-primary mb-2">Profile Settings</h2>
        <p className="text-body-sm text-text-secondary">Update your personal information below.</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="form-label">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInput}
                required
                className="form-input !pl-11"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email Field - Read Only */}
          <div>
            <label htmlFor="email" className="form-label">
              Email Address (Cannot be changed)
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="form-input !pl-11 bg-forest-50/50 cursor-not-allowed opacity-75"
                title="Email cannot be changed"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-forest-50 p-6 rounded-2xl border border-border-light">
          <label className="form-label mb-3">
            Profile Photo
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <figure className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden flex-shrink-0 bg-white">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <FiUser className="w-8 h-8" />
                </div>
              )}
            </figure>
            <div className="relative flex-1 w-full">
              <input
                type="file"
                id="photo"
                name="photo"
                accept=".png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileInput}
                disabled={uploading}
              />
              <div className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border-default rounded-xl bg-white transition-all duration-300 cursor-pointer group ${uploading ? 'opacity-50' : 'hover:bg-forest-50 hover:border-accent'}`}>
                {uploading ? (
                  <>
                    <FiLoader className="w-5 h-5 text-accent mr-3 animate-spin" />
                    <span className="text-body-sm font-semibold text-text-secondary">Uploading image...</span>
                  </>
                ) : (
                  <>
                    <FiUpload className="w-5 h-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-body-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">Click to upload new photo</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-caption text-text-muted mt-3 ml-2">PNG, JPG up to 5MB</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border-light flex justify-end">
          <button
            type="submit"
            className="btn-cta-lg w-full sm:w-auto min-w-[200px]"
            disabled={uploading}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;