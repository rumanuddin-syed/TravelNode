import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import { FiUsers, FiUserCheck, FiCalendar, FiMap } from 'react-icons/fi';

const AdminMediatorManagement = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [mediators, setMediators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
      // Filter out bookings that don't need mediators (hours not set) or we can just show all
      // Let's assume all bookings are fetched
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
        toast.success("Mediator assigned successfully!");
        fetchBookings();
        setShowModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign mediator.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="section-overline">Admin Space</span>
          <h1 className="text-display-md text-text-primary mt-2 flex items-center justify-center md:justify-start gap-3">
            <FiUsers className="text-accent" /> Mediator Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-2">Assign language mediators to customer bookings.</p>
        </div>

        <div className="grid gap-6">
          {bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking._id} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3 flex-1">
                <h3 className="text-body-lg font-bold text-text-primary flex items-center gap-2">
                  <FiMap className="text-accent" /> {booking.tourName}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-body-sm text-text-secondary">
                  <span className="flex items-center gap-1.5"><FiUserCheck className="text-cta" /> {booking.fullName}</span>
                  <span className="w-1 h-1 rounded-full bg-border-default"></span>
                  <span className="flex items-center gap-1.5"><FiCalendar className="text-warning" /> {new Date(booking.date).toLocaleDateString()}</span>
                </div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-forest-50 border border-border-light text-primary mt-2">
                  <span className="text-text-muted">Current Mediator:</span> 
                  {booking.mediatorId
                    ? mediators.find((m) => m._id === booking.mediatorId)?.username || 'Unknown'
                    : <span className="text-danger italic">Not Assigned</span>}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowModal(true);
                }}
                className="btn-outline shrink-0 whitespace-nowrap"
              >
                Assign Mediator
              </button>
            </div>
          )) : (
            <div className="card p-12 text-center">
              <p className="text-body-lg text-text-secondary">No bookings available.</p>
            </div>
          )}
        </div>

        {/* Modal for assigning mediator */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-elevated border border-border-light">
              <h2 className="text-body-lg font-bold text-text-primary mb-2">
                Assign Mediator
              </h2>
              <p className="text-body-sm text-text-secondary mb-6">For booking: <span className="font-bold text-primary">{selectedBooking.tourName}</span></p>
              
              <div className="grid gap-3 max-h-64 overflow-y-auto pr-2 mb-6 hide-scrollbar">
                {mediators.length > 0 ? mediators.map((mediator) => (
                  <button
                    key={mediator._id}
                    onClick={() => assignMediator(selectedBooking._id, mediator._id)}
                    className="p-4 border border-border-light rounded-xl hover:border-accent hover:bg-forest-50 text-left transition-all duration-200 group flex items-center justify-between"
                  >
                    <span className="font-bold text-primary group-hover:text-accent">{mediator.username}</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-white border border-border-default rounded-md group-hover:bg-accent group-hover:text-white group-hover:border-transparent transition-colors">Select</span>
                  </button>
                )) : (
                  <p className="text-center text-text-muted text-sm py-4">No mediators available.</p>
                )}
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="btn-ghost w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMediatorManagement;