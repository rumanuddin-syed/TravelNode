import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import avatar from "../../assets/images/avatar.jpg";
import Bookings from "./Bookings";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import { FiUser, FiMail, FiSettings, FiCalendar } from "react-icons/fi";
import BookingCard from "../../shared/BookingCard";
import useFetch from "../../hooks/useFetch";


const MyAccount = () => {
  const { user, dispatch, token } = useContext(AuthContext);
  const [tab, setTab] = useState("bookings");
  const navigate = useNavigate();
  const { apiData: bookings, loading, error } = useFetch(`${BASE_URL}/booking/${user._id}`);

  const confirmDelete = async () => {
    const result = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (result) {
      deleteAccount();
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/users/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
      } else {
        dispatch({ type: "LOGOUT" });
        navigate("/register");
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          {console.log(user)}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
              {/* Header with gradient */}
              <div className="h-24 bg-gradient-to-r from-BaseColor to-BHoverColor"></div>
              {}
              {/* Avatar - centered overlapping */}
              <div className="flex justify-center -mt-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-full blur-md opacity-75"></div>
                  <figure className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src={avatar}
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mt-4 px-6 pb-6">
                <h3 className="text-xl font-bold text-gray-900">{user?.username}</h3>
                <p className="text-gray-500 text-sm flex items-center justify-center mt-1">
                  <FiMail className="mr-1" /> {user?.email}
                </p>

                {/* Stats Placeholder (optional) */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-lg font-bold text-BaseColor">{bookings?bookings.length:0}</span>
                    <span className="text-xs text-gray-500">Bookings</span>
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-BaseColor">0</span>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setTab("settings")}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-BaseColor to-BHoverColor text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FiSettings className="w-5 h-5" />
                    <span>Update Profile</span>
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 hover:text-BaseColor transition-all duration-300"
                  >
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-1 inline-flex mb-6">
              <button
                onClick={() => setTab("bookings")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  tab === "bookings"
                    ? "bg-gradient-to-r from-BaseColor to-BHoverColor text-white shadow-md"
                    : "text-gray-600 hover:text-BaseColor hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </span>
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  tab === "settings"
                    ? "bg-gradient-to-r from-BaseColor to-BHoverColor text-white shadow-md"
                    : "text-gray-600 hover:text-BaseColor hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <FiSettings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {tab === "bookings" && <Bookings />}
              {tab === "settings" && <Profile user={user} dispatch={dispatch} token={token} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;