import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import avatar from "../../assets/images/avatar.jpg";
import Bookings from "./Bookings";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import { FiUser, FiMail, FiSettings, FiCalendar, FiLogOut } from "react-icons/fi";
import BookingCard from "../../shared/BookingCard";
import useFetch from "../../hooks/useFetch";

const MyAccount = () => {
  const { user, dispatch, token } = useContext(AuthContext);
  const [tab, setTab] = useState("bookings");
  const navigate = useNavigate();
  const { apiData: bookings, loading: loadingBookings } = useFetch(user?._id ? `${BASE_URL}/booking/${user._id}` : null);
  const { apiData: reviews, loading: loadingReviews } = useFetch(user?._id ? `${BASE_URL}/review?userId=${user._id}` : null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const confirmDelete = async () => {
    const result = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
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

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <section className="bg-background min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="card overflow-hidden sticky top-32">
              {/* Header with gradient */}
              <div className="h-32 bg-gradient-forest"></div>

              {/* Avatar - centered overlapping */}
              <div className="flex justify-center -mt-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md transform translate-y-2"></div>
                  <figure className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-forest-50 shadow-sm">
                    <img
                      src={user?.photo || avatar}
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mt-4 px-6 pb-8">
                <h3 className="text-display-sm text-text-primary">{user?.username}</h3>
                <p className="text-body-sm text-text-secondary flex items-center justify-center mt-1.5 gap-1.5">
                  <FiMail className="text-accent" /> {user?.email}
                </p>

                {/* Stats Bar */}
                <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-border-light text-center">
                  <div className="flex flex-col items-center">
                    <span className="block text-display-sm font-bold text-primary min-w-[40px]">
                      {loadingBookings ? "..." : (bookings ? bookings.length : 0)}
                    </span>
                    <span className="text-caption font-bold text-text-muted uppercase tracking-wider">Bookings</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-display-sm font-bold text-primary min-w-[40px]">
                      {loadingReviews ? "..." : (reviews ? reviews.length : 0)}
                    </span>
                    <span className="text-caption font-bold text-text-muted uppercase tracking-wider">Reviews</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => setTab("settings")}
                    className="w-full btn-cta"
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Update Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-outline"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="w-full btn-ghost !text-danger hover:!bg-red-50 pt-4"
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
            <div className="bg-white rounded-2xl shadow-sm border border-border-light p-1.5 inline-flex mb-6 max-w-full overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setTab("bookings")}
                className={`px-6 py-3 rounded-xl text-body-sm font-bold transition-all duration-300 whitespace-nowrap ${tab === "bookings"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-primary hover:bg-forest-50"
                  }`}
              >
                <span className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </span>
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`px-6 py-3 rounded-xl text-body-sm font-bold transition-all duration-300 whitespace-nowrap ${tab === "settings"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-primary hover:bg-forest-50"
                  }`}
              >
                <span className="flex items-center space-x-2">
                  <FiSettings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="card p-6 md:p-8">
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