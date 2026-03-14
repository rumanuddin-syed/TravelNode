import React, { useContext } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../shared/BookingCard";
import { FiCalendar, FiUsers, FiDollarSign } from "react-icons/fi";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const { apiData: bookings, loading, error } = useFetch(`${BASE_URL}/booking/${user._id}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-BaseColor rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load bookings</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FiCalendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Bookings Yet</h3>
        <p className="text-gray-500 mt-1">Start exploring tours and book your first adventure!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
      <p className="text-gray-600">Manage your upcoming and past tour bookings.</p>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (visible on mobile) */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default Bookings;