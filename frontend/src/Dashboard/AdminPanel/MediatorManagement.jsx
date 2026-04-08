import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';

const AdminMediatorManagement = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [mediators, setMediators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchMediators();
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

  const fetchMediators = async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/mediators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setMediators(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignMediator = async (bookingId, mediatorId) => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/assign-mediator/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ mediatorId }),
      });
      const result = await res.json();
      if (result.success) {
        fetchBookings();
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Mediators</h1>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{booking.tourName}</h3>
                <p>Customer: {booking.fullName}</p>
                <p>Date: {booking.date}</p>
                <p>
                  Current Mediator:{' '}
                  {booking.mediatorId
                    ? mediators.find((m) => m._id === booking.mediatorId)?.username
                    : 'Not Assigned'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Assign Mediator
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for assigning mediator */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Assign Mediator to {selectedBooking.tourName}</h2>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {mediators.map((mediator) => (
                <button
                  key={mediator._id}
                  onClick={() => assignMediator(selectedBooking._id, mediator._id)}
                  className="p-3 border rounded-lg hover:bg-blue-50 text-left"
                >
                  {mediator.username}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediatorManagement;