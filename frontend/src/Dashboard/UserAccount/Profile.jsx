import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { FiUpload } from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, dispatch } = useContext(AuthContext);
  const { apiData: updatedUser, error } = useFetch(
    `${BASE_URL}/tour/${user._id}`
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    photo: "",
  });

  useEffect(() => {
    setFormData({ username: user.username, email: user.email, photo: "" });
  }, [user]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const { message } = await response.json();

      if (response.ok) {
        dispatch({
          type: "UPDATE_USER",
          payload: {
            user: response.data,
            token: response.token,
          },
        });

        navigate("/login");
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      <p className="text-gray-600">Update your personal information below.</p>

      <form onSubmit={submitHandler} className="space-y-5">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition-all duration-300"
            placeholder="Enter your name"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition-all duration-300"
            placeholder="Enter your email"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center space-x-4">
            {user.photo && (
              <figure className="w-16 h-16 rounded-full border-2 border-BaseColor overflow-hidden">
                <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
              </figure>
            )}
            <div className="relative flex-1">
              <input
                type="file"
                id="photo"
                name="photo"
                accept=".png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  // Handle file upload logic if needed (currently not used)
                }}
              />
              <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Click to upload new photo</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-BaseColor to-BHoverColor text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;