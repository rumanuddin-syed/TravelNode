import React, { useContext } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../shared/BookingCard";
import { FiCalendar } from "react-icons/fi";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const { apiData: bookings, loading, error } = useFetch(`${BASE_URL}/booking/${user._id}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger font-medium">Failed to load bookings</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-forest-50/50 rounded-2xl border border-dashed border-border-default">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-sm rounded-full mb-6">
          <FiCalendar className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-display-sm text-text-primary mb-2">No Bookings Yet</h3>
        <p className="text-body-lg text-text-secondary">Start exploring tours and book your first adventure!</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-display-sm text-text-primary mb-2">My Bookings</h2>
        <p className="text-body-sm text-text-secondary">Manage your upcoming and past tour bookings.</p>
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border-light bg-white">
        <table className="w-full">
          <thead className="bg-forest-50 border-b border-border-light">
            <tr>
              <th className="px-6 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Tour</th>
              <th className="px-6 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Guests</th>
              <th className="px-6 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-right text-caption font-bold text-text-muted uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
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