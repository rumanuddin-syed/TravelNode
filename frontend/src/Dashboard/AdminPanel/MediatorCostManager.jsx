import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import {
  FiDollarSign, FiClock, FiEdit2, FiSave, FiX, FiRefreshCw,
  FiSearch, FiUser, FiCalendar, FiChevronDown, FiChevronUp,
  FiCheckCircle, FiAlertCircle, FiFilter, FiUsers,
} from 'react-icons/fi';

/* ─── Badge helper ──────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${map[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
};

/* ─── main component ────────────────────────────────────────── */
const MediatorCostManager = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [mediators, setMediators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editCost, setEditCost] = useState('');
  const [editHours, setEditHours] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'assigned' | 'unassigned'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };

  /* ─── fetch ─────────────────────────────────────────────── */
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/booking/all-bookings`, { headers: authHeader });
      const result = await res.json();
      if (result.success) setBookings(result.data);
      else toast.error('Failed to load bookings');
    } catch (e) { toast.error('Network error loading bookings'); }
  }, []);

  const fetchMediators = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/mediators`, { headers: authHeader });
      const result = await res.json();
      if (result.success) setMediators(result.data);
    } catch (e) { console.error(e); }
  }, []);

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchMediators()]);
    setLoading(false);
  };

  useEffect(() => { window.scrollTo(0, 0); refreshAll(); }, []);

  /* ─── actions ───────────────────────────────────────────── */
  const handleEditStart = (booking) => {
    setEditingBookingId(booking._id);
    setExpandedId(booking._id);
    setEditCost(booking.costPerHour ?? '');
    setEditHours(booking.hours ?? '');
  };

  const handleSaveCost = async (bookingId) => {
    if (editCost === '' || editHours === '') return toast.error('Please enter both cost and hours');
    if (parseFloat(editCost) < 0 || parseFloat(editHours) < 0) return toast.error('Values must be positive');
    setIsSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/mediator/booking-cost/${bookingId}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({ costPerHour: parseFloat(editCost), hours: parseFloat(editHours) }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Cost updated successfully');
        setEditingBookingId(null);
        fetchBookings();
      } else { toast.error(result.message); }
    } catch (e) { toast.error('Error updating cost'); }
    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
    setEditCost('');
    setEditHours('');
  };

  /* ─── derived data ──────────────────────────────────────── */
  const getMediatorName = (mediatorId) => {
    if (!mediatorId) return null;
    const m = mediators.find(med => med._id?.toString() === mediatorId?.toString());
    return m?.userId?.username || 'Unknown';
  };

  const filteredBookings = bookings
    .filter(b => {
      if (filterMode === 'assigned') return !!b.mediatorId;
      if (filterMode === 'unassigned') return !b.mediatorId;
      return true;
    })
    .filter(b =>
      !searchQuery ||
      b.tourName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getMediatorName(b.mediatorId)?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Stats
  const withMediator = bookings.filter(b => b.mediatorId);
  const totalMediatorCost = withMediator.reduce((sum, b) => sum + (b.costPerHour || 0) * (b.hours || 0), 0);
  const totalHours = withMediator.reduce((sum, b) => sum + (b.hours || 0), 0);

  /* ─── loading ───────────────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  /* ─── render ────────────────────────────────────────────── */
  return (
    <div className="bg-background min-h-screen py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="section-overline">Admin Space</span>
            <h1 className="text-display-md text-text-primary mt-1 flex items-center gap-3">
              <FiDollarSign className="text-cta" /> Mediator Cost Management
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Set hourly rates and session durations for mediator-assigned bookings.
            </p>
          </div>
          <button onClick={refreshAll} className="btn-ghost gap-2 text-sm self-start md:self-auto">
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: FiCalendar, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'With Mediator', value: withMediator.length, icon: FiUsers, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Hours', value: `${totalHours}h`, icon: FiClock, color: 'text-accent', bg: 'bg-sky-50' },
            { label: 'Total Cost', value: `₹${totalMediatorCost.toLocaleString()}`, icon: FiDollarSign, color: 'text-cta', bg: 'bg-amber-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-caption text-text-muted font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold text-text-primary">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search by tour, customer or mediator…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input !pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'assigned', label: 'With Mediator' },
              { id: 'unassigned', label: 'No Mediator' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  filterMode === f.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-secondary border-border-default hover:border-primary hover:text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Booking list */}
        {filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <FiDollarSign className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
            <p className="text-text-secondary text-lg font-semibold">No bookings found</p>
            <p className="text-text-muted text-sm mt-1">Try adjusting your filter or search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const isEditing = editingBookingId === booking._id;
              const isExpanded = expandedId === booking._id;
              const mediatorName = getMediatorName(booking.mediatorId);
              const totalCost = (booking.costPerHour || 0) * (booking.hours || 0);
              const previewCost = isEditing
                ? (parseFloat(editCost) || 0) * (parseFloat(editHours) || 0)
                : totalCost;

              return (
                <div key={booking._id} className="card overflow-hidden hover:shadow-md transition-shadow">
                  {/* Row header */}
                  <div className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-text-primary">{booking.tourName}</h3>
                        <StatusBadge status={booking.status} />
                        {!booking.mediatorId && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-orange-50 text-orange-700 border-orange-200">
                            No Mediator
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1.5"><FiUser className="text-cta" /> {booking.fullName}</span>
                        <span className="flex items-center gap-1.5"><FiCalendar className="text-accent" />
                          {new Date(booking.startDate).toLocaleDateString()}
                        </span>
                        {mediatorName && (
                          <span className="flex items-center gap-1.5 text-green-700 font-semibold">
                            <FiUsers className="w-3.5 h-3.5" /> {mediatorName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cost summary */}
                    <div className="flex items-center gap-3 flex-wrap shrink-0">
                      <div className="text-right">
                        <p className="text-caption text-text-muted font-semibold uppercase tracking-wider">
                          {isEditing ? 'Preview Cost' : 'Total Cost'}
                        </p>
                        <p className={`text-2xl font-bold ${isEditing ? 'text-cta' : 'text-text-primary'}`}>
                          ₹{previewCost.toLocaleString()}
                        </p>
                        {(booking.costPerHour > 0 || booking.hours > 0) && (
                          <p className="text-xs text-text-muted">
                            ₹{booking.costPerHour || 0}/hr × {booking.hours || 0}h
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!isEditing && (
                          <button onClick={() => handleEditStart(booking)} className="btn-outline text-sm py-1.5 px-3 gap-1.5">
                            <FiEdit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                          className="p-2 rounded-xl border border-border-default hover:bg-forest-50 text-text-secondary transition-colors"
                        >
                          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div className="border-t border-border-light bg-forest-50/30 p-5 animate-fade-in">
                      {isEditing ? (
                        /* ── Edit form ── */
                        <div className="space-y-5">
                          <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                            <FiEdit2 className="text-accent" /> Set Mediator Costs
                          </h4>

                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="form-label">Cost per Hour (₹)</label>
                              <div className="relative">
                                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                  type="number"
                                  value={editCost}
                                  onChange={e => setEditCost(e.target.value)}
                                  className="form-input !pl-11"
                                  step="50"
                                  min="0"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="form-label">Total Hours</label>
                              <div className="relative">
                                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                  type="number"
                                  value={editHours}
                                  onChange={e => setEditHours(e.target.value)}
                                  className="form-input !pl-11"
                                  step="0.5"
                                  min="0"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Live preview */}
                          <div className="bg-white border border-border-light rounded-xl px-5 py-4 flex items-center justify-between">
                            <div className="text-sm text-text-secondary">
                              <span className="font-bold text-text-primary">₹{parseFloat(editCost) || 0}</span>/hr ×{' '}
                              <span className="font-bold text-text-primary">{parseFloat(editHours) || 0}</span> hrs
                            </div>
                            <div className="text-right">
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-0.5">Total</p>
                              <p className="text-3xl font-bold text-primary">
                                ₹{((parseFloat(editCost) || 0) * (parseFloat(editHours) || 0)).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSaveCost(booking._id)}
                              disabled={isSaving}
                              className="btn-cta gap-2 flex-1 md:flex-none justify-center disabled:opacity-50"
                            >
                              <FiSave className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save Cost'}
                            </button>
                            <button onClick={handleCancelEdit} className="btn-ghost gap-2">
                              <FiX className="w-4 h-4" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Details view ── */
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-sky-50 rounded-xl px-4 py-3 border border-sky-100">
                              <p className="text-caption font-bold text-sky-800/60 uppercase tracking-widest mb-1">Rate / Hr</p>
                              <p className="font-bold text-sky-900 text-lg">₹{booking.costPerHour || 0}</p>
                            </div>
                            <div className="bg-forest-50 rounded-xl px-4 py-3 border border-forest-100">
                              <p className="text-caption font-bold text-forest-800/60 uppercase tracking-widest mb-1">Hours</p>
                              <p className="font-bold text-forest-900 text-lg">{booking.hours || 0}h</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                              <p className="text-caption font-bold text-amber-800/60 uppercase tracking-widest mb-1">Total Cost</p>
                              <p className="font-bold text-amber-900 text-lg">₹{totalCost.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Group Size</p>
                              <p className="text-text-primary font-semibold">{booking.maxGroupSize} persons</p>
                            </div>
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Tour Price</p>
                              <p className="text-text-primary font-semibold">₹{booking.totalPrice?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Start Date</p>
                              <p className="text-text-primary">{new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">End Date</p>
                              <p className="text-text-primary">{new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                          </div>

                          {!booking.mediatorId && (
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
                              <FiAlertCircle className="w-4 h-4 shrink-0" />
                              No mediator assigned. Go to <strong>Mediator Management → Booking Assignment</strong> to assign one first.
                            </div>
                          )}

                          <div className="pt-2 flex gap-2">
                            <button onClick={() => handleEditStart(booking)} className="btn-outline text-sm gap-2">
                              <FiEdit2 className="w-3.5 h-3.5" /> Edit Cost & Hours
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediatorCostManager;