import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';

const MediatorCostManager = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [costPerHour, setCostPerHour] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/booking/all-bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingCost = async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/booking-cost/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          costPerHour: parseFloat(costPerHour),
          hours: parseFloat(hours),
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchBookings();
        setEditingBooking(null);
        setCostPerHour('');
        setHours('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking._id);
    setCostPerHour(booking.costPerHour || '');
    setHours(booking.hours || '');
  };

  const calculateTotalCost = (booking) => {
    return booking.costPerHour * booking.hours;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mediator Cost Management</h1>
      <div className="grid gap-4">
        {bookings.filter((b) => b.mediatorId).map((booking) => (
          <div key={booking._id} className="booking-card p-4 border rounded-lg">
            {editingBooking === booking._id ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">{booking.tourName}</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost per Hour (Rs.)</label>
                  <input
                    type="number"
                    value={costPerHour}
                    onChange={(e) => setCostPerHour(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    step="0.5"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateBookingCost(booking._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingBooking(null);
                      setCostPerHour('');
                      setHours('');
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{booking.tourName}</h3>
                  <p>Customer: {booking.fullName}</p>
                  <p>Date: {booking.date}</p>
                  <p>Cost per Hour: Rs. {booking.costPerHour || 0}</p>
                  <p>Hours: {booking.hours || 0}</p>
                  <p className="font-bold">
                    Total Mediator Cost: Rs. {calculateTotalCost(booking) || 0}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(booking)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediatorCostManager;