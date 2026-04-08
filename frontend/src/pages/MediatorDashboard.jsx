import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/config';
import { BiBookmark, BiMoney, BiStar, BiCheckCircle } from 'react-icons/bi';

const MediatorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchMediatorStats();
      fetchMediatorBookings();
    }
  }, [user]);

  const fetchMediatorStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator-profile/stats/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error fetching stats:', result.message);
      }
    } catch (error) {
      console.error('Error fetching mediator stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediatorBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/mediator-bookings/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setBookings(result.data);
      } else {
        console.error('Error fetching bookings:', result.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );

  if (!stats) {
    return (
      <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No dashboard data available. Please try refreshing.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mediator Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.username}</p>
          </div>
          <button
            onClick={() => navigate('/mediator-profile')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold transition shadow-md"
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                </div>
                <BiBookmark className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            {/* Completed Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedBookings}</p>
                </div>
                <BiCheckCircle className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>

            {/* Cost Per Hour */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Cost Per Hour</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">Rs. {stats.costPerHour}</p>
                </div>
                <BiMoney className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">Rs. {stats.totalEarnings}</p>
                </div>
                <BiMoney className="w-12 h-12 text-yellow-500 opacity-20" />
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Out of 5</p>
                </div>
                <BiStar className="w-12 h-12 text-red-500 opacity-20" />
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Status</p>
                  <p className={`text-lg font-bold mt-2 ${stats.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.isAvailable ? 'Available' : 'Unavailable'}
                  </p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-3">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {stats.languages && stats.languages.length > 0 ? (
                    stats.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No languages added</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            {bookings.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tour Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Hours</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Hourly Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.tourName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.hours || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">Rs. {booking.costPerHour || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        Rs. {((booking.costPerHour || 0) * (booking.hours || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No bookings yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediatorDashboard;