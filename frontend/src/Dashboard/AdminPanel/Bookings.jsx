import React from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import AdminBookingCard from "../../shared/AdminBookings";

const Bookings = () => {
  const { apiData: bookings } = useFetch(`${BASE_URL}/booking`);

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Tour Name</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">User Name</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">User ID</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Persons</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Booked for</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Booked on</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
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