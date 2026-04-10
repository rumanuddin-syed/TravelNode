import React, { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import AdminBookingCard from "../../shared/AdminBookings";
import { FiList } from "react-icons/fi";

const Bookings = () => {
  const { apiData: bookings } = useFetch(`${BASE_URL}/booking`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-display-sm text-text-primary mb-2 flex items-center gap-2">
            <FiList className="text-accent" /> Manage Bookings
          </h2>
          <p className="text-body-sm text-text-secondary">View and manage all customer bookings.</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-forest-50 border-b border-border-light table-header">
                <tr>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Tour Name</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">User Name</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">User ID</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Persons</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Booked for</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Booked on</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Price</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {bookings?.map((booking) => (
                  <AdminBookingCard booking={booking} key={booking._id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;