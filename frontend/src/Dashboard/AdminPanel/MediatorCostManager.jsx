import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import { FiDollarSign, FiClock, FiEdit2, FiSave, FiX, FiCheckCircle } from 'react-icons/fi';

const MediatorCostManager = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [costPerHour, setCostPerHour] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
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
      toast.error("Failed to load bookings");
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
        toast.success("Cost updated successfully");
        fetchBookings();
        setEditingBooking(null);
        setCostPerHour('');
        setHours('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating cost");
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking._id);
    setCostPerHour(booking.costPerHour || '');
    setHours(booking.hours || '');
  };

  const calculateTotalCost = (booking) => {
    return (booking.costPerHour || 0) * (booking.hours || 0);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="section-overline">Admin Space</span>
          <h1 className="text-display-md text-text-primary mt-2 flex items-center justify-center md:justify-start gap-3">
            <FiDollarSign className="text-cta" /> Mediator Cost Management
          </h1>
          <p className="text-body-sm text-text-secondary mt-2">Manage hourly rates and set durations for active mediator bookings.</p>
        </div>

        <div className="grid gap-6">
          {bookings.filter((b) => b.mediatorId).length > 0 ? bookings.filter((b) => b.mediatorId).map((booking) => (
            <div key={booking._id} className="card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {editingBooking === booking._id ? (
                <div className="p-6 md:p-8 space-y-6 animate-fade-in bg-forest-50/30">
                  <h3 className="text-body-lg font-bold text-text-primary flex items-center gap-2">
                    Editing: {booking.tourName}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label text-text-secondary">Cost per Hour (₹)</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="number"
                          value={costPerHour}
                          onChange={(e) => setCostPerHour(e.target.value)}
                          className="form-input !pl-11"
                          step="50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label text-text-secondary">Total Hours</label>
                      <div className="relative">
                        <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="number"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="form-input !pl-11"
                          step="0.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                    <button
                      onClick={() => updateBookingCost(booking._id)}
                      className="btn-cta group flex-1 md:flex-none justify-center"
                    >
                      <FiSave className="w-4 h-4 group-hover:scale-110 transition-transform" /> Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingBooking(null);
                        setCostPerHour('');
                        setHours('');
                      }}
                      className="btn-ghost flex-1 md:flex-none justify-center"
                    >
                      <FiX className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-body-lg font-bold text-text-primary mb-1">{booking.tourName}</h3>
                      <p className="text-caption text-text-muted">Customer: <span className="font-semibold text-text-secondary">{booking.fullName}</span></p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 flex-1 min-w-[120px]">
                        <p className="text-caption font-bold text-sky-800/60 uppercase tracking-widest mb-1">Cost / Hr</p>
                        <p className="font-bold text-sky-900">₹{booking.costPerHour || 0}</p>
                      </div>
                      <div className="bg-forest-50 px-4 py-2 rounded-xl border border-forest-100 flex-1 min-w-[120px]">
                        <p className="text-caption font-bold text-forest-800/60 uppercase tracking-widest mb-1">Hours</p>
                        <p className="font-bold text-forest-900">{booking.hours || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
                    <div className="bg-white px-5 py-3 rounded-2xl border border-border-light shadow-sm w-full md:w-auto text-left md:text-right">
                      <p className="text-caption font-bold text-text-muted uppercase tracking-wider mb-1">Total Mediator Cost</p>
                      <p className="text-3xl font-bold text-primary">₹{calculateTotalCost(booking)}</p>
                    </div>
                    
                    <button
                      onClick={() => handleEdit(booking)}
                      className="btn-outline w-full md:w-auto self-end"
                    >
                      <FiEdit2 className="w-4 h-4" /> Edit Costs
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="card p-12 text-center text-text-secondary">
              No bookings with assigned mediators found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediatorCostManager;