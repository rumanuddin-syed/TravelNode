import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import {
  FiUsers, FiUserCheck, FiUserX, FiUser, FiEdit2, FiSave, FiX,
  FiPlusCircle, FiToggleLeft, FiToggleRight, FiCalendar, FiMap,
  FiDollarSign, FiStar, FiChevronDown, FiChevronUp, FiRefreshCw,
  FiSearch, FiTrash2, FiInfo, FiCheck
} from 'react-icons/fi';

/* ─── tiny helpers ─────────────────────────────────────────── */
const Avatar = ({ src, name, size = 40 }) => {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  return src ? (
    <img src={src} alt={name} className="rounded-full object-cover border-2 border-border-light" style={{ width: size, height: size }} />
  ) : (
    <div className="rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-primary to-accent border-2 border-border-light"
      style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
};

const Badge = ({ children, color = 'green' }) => {
  const map = {
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${map[color] || map.gray}`}>
      {children}
    </span>
  );
};

/* ─── main component ────────────────────────────────────────── */
const AdminMediatorManagement = () => {
  const { user } = useContext(AuthContext);

  // Data
  const [mediators, setMediators] = useState([]);
  const [nonMediatorUsers, setNonMediatorUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mediators'); // 'mediators' | 'assign' | 'promote'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMediatorId, setExpandedMediatorId] = useState(null);
  const [editingMediatorId, setEditingMediatorId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState('');
  const [promoteForm, setPromoteForm] = useState({ languages: '', bio: '', costPerHour: '', phone: '', experience: '' });
  const [assignModal, setAssignModal] = useState(null); // booking being assigned
  const [userSearch, setUserSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };

  /* ─── fetch functions ───────────────────────────────────── */
  const fetchMediators = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/mediators`, { headers: authHeader });
      const result = await res.json();
      if (result.success) setMediators(result.data);
      else toast.error('Failed to load mediators');
    } catch (e) { toast.error('Network error loading mediators'); }
  }, []);

  const fetchNonMediatorUsers = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/non-mediator-users`, { headers: authHeader });
      const result = await res.json();
      if (result.success) setNonMediatorUsers(result.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/booking/all-bookings`, { headers: authHeader });
      const result = await res.json();
      if (result.success) setBookings(result.data);
    } catch (e) { console.error(e); }
  }, []);

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchMediators(), fetchNonMediatorUsers(), fetchBookings()]);
    setLoading(false);
  };

  useEffect(() => { window.scrollTo(0, 0); refreshAll(); }, []);

  /* ─── actions ───────────────────────────────────────────── */
  const handleToggleAvailability = async (mediatorId) => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/mediator/${mediatorId}/toggle-availability`, { method: 'PUT', headers: authHeader });
      const result = await res.json();
      if (result.success) { toast.success(result.message); fetchMediators(); }
      else toast.error(result.message);
    } catch (e) { toast.error('Failed to toggle availability'); }
  };

  const handleDemote = async (mediatorId, name) => {
    if (!window.confirm(`Demote "${name}" back to regular user?`)) return;
    try {
      const res = await fetch(`${BASE_URL}/mediator/mediator/${mediatorId}/demote`, { method: 'PUT', headers: authHeader });
      const result = await res.json();
      if (result.success) { toast.success('Mediator demoted successfully'); refreshAll(); }
      else toast.error(result.message);
    } catch (e) { toast.error('Failed to demote mediator'); }
  };

  const handleEditSave = async (mediatorId) => {
    setIsSaving(true);
    try {
      const payload = {
        ...editForm,
        languages: typeof editForm.languages === 'string'
          ? editForm.languages.split(',').map(l => l.trim()).filter(Boolean)
          : editForm.languages,
        certifications: typeof editForm.certifications === 'string'
          ? editForm.certifications.split(',').map(c => c.trim()).filter(Boolean)
          : editForm.certifications,
        costPerHour: parseFloat(editForm.costPerHour) || 0,
      };
      const res = await fetch(`${BASE_URL}/mediator/mediator/${mediatorId}`, {
        method: 'PUT', headers: authHeader, body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) { toast.success('Mediator updated successfully'); setEditingMediatorId(null); fetchMediators(); }
      else toast.error(result.message);
    } catch (e) { toast.error('Failed to save changes'); }
    setIsSaving(false);
  };

  const handlePromote = async () => {
    if (!promoteUserId) return toast.error('Please select a user');
    setIsSaving(true);
    try {
      const payload = {
        userId: promoteUserId,
        languages: promoteForm.languages.split(',').map(l => l.trim()).filter(Boolean),
        bio: promoteForm.bio,
        costPerHour: parseFloat(promoteForm.costPerHour) || 0,
        phone: promoteForm.phone,
        experience: promoteForm.experience,
      };
      const res = await fetch(`${BASE_URL}/mediator/promote`, {
        method: 'POST', headers: authHeader, body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('User promoted to mediator!');
        setShowPromoteModal(false);
        setPromoteUserId('');
        setPromoteForm({ languages: '', bio: '', costPerHour: '', phone: '', experience: '' });
        refreshAll();
      } else toast.error(result.message);
    } catch (e) { toast.error('Failed to promote user'); }
    setIsSaving(false);
  };

  const handleAssignMediator = async (bookingId, mediatorId) => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/assign-mediator/${bookingId}`, {
        method: 'PUT', headers: authHeader, body: JSON.stringify({ mediatorId }),
      });
      const result = await res.json();
      if (result.success) { toast.success('Mediator assigned!'); setAssignModal(null); fetchBookings(); }
      else toast.error(result.message);
    } catch (e) { toast.error('Failed to assign mediator'); }
  };

  const handleUnassignMediator = async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/mediator/unassign-mediator/${bookingId}`, { method: 'PUT', headers: authHeader });
      const result = await res.json();
      if (result.success) { toast.success('Mediator removed from booking'); fetchBookings(); }
      else toast.error(result.message);
    } catch (e) { toast.error('Failed to unassign mediator'); }
  };

  /* ─── derived data ──────────────────────────────────────── */
  const filteredMediators = mediators.filter(m =>
    !searchQuery || m.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.languages?.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = nonMediatorUsers.filter(u =>
    !userSearch || u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const getMediatorName = (mediatorId) => {
    const m = mediators.find(med => med._id === mediatorId || med._id?.toString() === mediatorId?.toString());
    return m?.userId?.username || 'Unknown';
  };

  /* ─── loading state ─────────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  /* ─── render ────────────────────────────────────────────── */
  return (
    <div className="bg-background min-h-screen py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="section-overline">Admin Space</span>
            <h1 className="text-display-md text-text-primary mt-1 flex items-center gap-3">
              <FiUsers className="text-accent" /> Mediator Management
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Manage mediator profiles, availability, languages &amp; booking assignments.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={refreshAll} className="btn-ghost gap-2 text-sm">
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={() => setShowPromoteModal(true)} className="btn-cta gap-2 text-sm">
              <FiPlusCircle className="w-4 h-4" /> Add Mediator
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Mediators', value: mediators.length, icon: FiUsers, color: 'text-primary' },
            { label: 'Available', value: mediators.filter(m => m.isAvailable).length, icon: FiUserCheck, color: 'text-green-600' },
            { label: 'Unavailable', value: mediators.filter(m => !m.isAvailable).length, icon: FiUserX, color: 'text-red-500' },
            { label: 'Bookings Assigned', value: bookings.filter(b => b.mediatorId).length, icon: FiCalendar, color: 'text-accent' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-caption text-text-muted font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6 border-b border-border-light">
          {[
            { id: 'mediators', label: 'Mediator Profiles', icon: FiUsers },
            { id: 'assign', label: 'Booking Assignments', icon: FiCalendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Mediator Profiles ───────────────────────────── */}
        {activeTab === 'mediators' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or language…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input !pl-10 text-sm"
              />
            </div>

            {filteredMediators.length === 0 ? (
              <div className="card p-12 text-center">
                <FiUsers className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
                <p className="text-text-secondary text-lg font-semibold mb-1">No mediators found</p>
                <p className="text-text-muted text-sm mb-5">Add a mediator by promoting a regular user.</p>
                <button onClick={() => setShowPromoteModal(true)} className="btn-cta mx-auto gap-2">
                  <FiPlusCircle className="w-4 h-4" /> Add First Mediator
                </button>
              </div>
            ) : filteredMediators.map(mediator => {
              const name = mediator.userId?.username || 'Unknown';
              const email = mediator.userId?.email || '';
              const photo = mediator.userId?.photo || '';
              const isExpanded = expandedMediatorId === mediator._id;
              const isEditing = editingMediatorId === mediator._id;
              const mediatorBookings = bookings.filter(b => b.mediatorId?.toString() === mediator._id?.toString());

              return (
                <div key={mediator._id} className="card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Card header */}
                  <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <Avatar src={photo} name={name} size={48} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-text-primary text-base">{name}</h3>
                          <Badge color={mediator.isAvailable ? 'green' : 'red'}>
                            {mediator.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-muted">{email}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {mediator.languages?.length > 0
                            ? mediator.languages.map(l => <Badge key={l} color="blue">{l}</Badge>)
                            : <span className="text-xs text-text-muted italic">No languages set</span>
                          }
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-right mr-2 hidden md:block">
                        <p className="text-caption text-text-muted font-semibold uppercase tracking-wider">Rate / Bookings</p>
                        <p className="text-sm font-bold text-text-primary">₹{mediator.costPerHour}/hr · {mediatorBookings.length} bookings</p>
                      </div>
                      <button
                        onClick={() => handleToggleAvailability(mediator._id)}
                        className={`p-2 rounded-xl border transition-colors ${mediator.isAvailable ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
                        title="Toggle Availability"
                      >
                        {mediator.isAvailable ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingMediatorId(isEditing ? null : mediator._id);
                          setExpandedMediatorId(mediator._id);
                          setEditForm({
                            languages: mediator.languages?.join(', ') || '',
                            bio: mediator.bio || '',
                            costPerHour: mediator.costPerHour || 0,
                            phone: mediator.phone || '',
                            certifications: mediator.certifications?.join(', ') || '',
                            experience: mediator.experience || '',
                            isAvailable: mediator.isAvailable,
                          });
                        }}
                        className="btn-outline text-sm py-1.5 px-3 gap-1.5"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setExpandedMediatorId(isExpanded ? null : mediator._id)}
                        className="p-2 rounded-xl border border-border-default hover:bg-forest-50 text-text-secondary transition-colors"
                      >
                        {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded / Edit panel */}
                  {isExpanded && (
                    <div className="border-t border-border-light bg-forest-50/30 p-5 animate-fade-in">
                      {isEditing ? (
                        /* ── Edit Form ── */
                        <div className="space-y-4">
                          <h4 className="font-bold text-text-primary text-sm mb-3 flex items-center gap-2">
                            <FiEdit2 className="text-accent" /> Edit Profile
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="form-label">Languages (comma-separated)</label>
                              <input type="text" value={editForm.languages} onChange={e => setEditForm(f => ({ ...f, languages: e.target.value }))} className="form-input text-sm" placeholder="English, Hindi, French" />
                            </div>
                            <div>
                              <label className="form-label">Cost per Hour (₹)</label>
                              <input type="number" value={editForm.costPerHour} onChange={e => setEditForm(f => ({ ...f, costPerHour: e.target.value }))} className="form-input text-sm" step="50" min="0" />
                            </div>
                            <div>
                              <label className="form-label">Phone</label>
                              <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="form-input text-sm" />
                            </div>
                            <div>
                              <label className="form-label">Experience</label>
                              <input type="text" value={editForm.experience} onChange={e => setEditForm(f => ({ ...f, experience: e.target.value }))} className="form-input text-sm" placeholder="3 years" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="form-label">Bio</label>
                              <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} className="form-input text-sm min-h-[80px] resize-none" placeholder="Short bio…" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="form-label">Certifications (comma-separated)</label>
                              <input type="text" value={editForm.certifications} onChange={e => setEditForm(f => ({ ...f, certifications: e.target.value }))} className="form-input text-sm" placeholder="IATA, 1st Aid" />
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button onClick={() => handleEditSave(mediator._id)} disabled={isSaving} className="btn-cta gap-2 text-sm">
                              <FiSave className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditingMediatorId(null)} className="btn-ghost text-sm gap-2">
                              <FiX className="w-4 h-4" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Details View ── */
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Phone</p>
                              <p className="text-sm text-text-primary">{mediator.phone || '—'}</p>
                            </div>
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Experience</p>
                              <p className="text-sm text-text-primary">{mediator.experience || '—'}</p>
                            </div>
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Rating</p>
                              <p className="text-sm text-text-primary flex items-center gap-1">
                                <FiStar className="text-yellow-400" /> {mediator.rating ? mediator.rating.toFixed(1) : '—'}
                              </p>
                            </div>
                          </div>
                          {mediator.bio && (
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Bio</p>
                              <p className="text-sm text-text-secondary">{mediator.bio}</p>
                            </div>
                          )}
                          {mediator.certifications?.length > 0 && (
                            <div>
                              <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-1">Certifications</p>
                              <div className="flex flex-wrap gap-1.5">
                                {mediator.certifications.map(c => <Badge key={c} color="yellow">{c}</Badge>)}
                              </div>
                            </div>
                          )}

                          {/* Assigned bookings */}
                          <div>
                            <p className="text-caption text-text-muted font-semibold uppercase tracking-wider mb-2">
                              Assigned Bookings ({mediatorBookings.length})
                            </p>
                            {mediatorBookings.length > 0 ? (
                              <div className="space-y-2">
                                {mediatorBookings.slice(0, 3).map(b => (
                                  <div key={b._id} className="bg-white rounded-lg px-4 py-2 border border-border-light flex justify-between items-center text-sm">
                                    <span className="font-semibold text-text-primary">{b.tourName}</span>
                                    <span className="text-text-muted">{new Date(b.startDate).toLocaleDateString()}</span>
                                  </div>
                                ))}
                                {mediatorBookings.length > 3 && (
                                  <p className="text-xs text-text-muted pl-1">+{mediatorBookings.length - 3} more</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-text-muted italic">No bookings assigned yet.</p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-border-light">
                            <button
                              onClick={() => handleDemote(mediator._id, name)}
                              className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <FiUserX className="w-4 h-4" /> Demote to Regular User
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

        {/* ── TAB: Booking Assignments ─────────────────────────── */}
        {activeTab === 'assign' && (
          <div className="space-y-4">
            <p className="text-body-sm text-text-secondary mb-2">
              Assign or change mediators for customer bookings. Bookings without mediators show first.
            </p>
            {bookings.length === 0 ? (
              <div className="card p-12 text-center text-text-secondary">No bookings available.</div>
            ) : [...bookings].sort((a, b) => (a.mediatorId ? 1 : -1)).map(booking => {
              const assignedMed = booking.mediatorId
                ? mediators.find(m => m._id?.toString() === booking.mediatorId?.toString())
                : null;
              const assignedName = assignedMed?.userId?.username || null;

              return (
                <div key={booking._id} className="card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-text-primary flex items-center gap-2">
                        <FiMap className="text-accent" /> {booking.tourName}
                      </h3>
                      {booking.status && (
                        <Badge color={booking.status === 'confirmed' ? 'green' : booking.status === 'pending' ? 'yellow' : 'gray'}>
                          {booking.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1.5"><FiUser className="text-cta" /> {booking.fullName}</span>
                      <span className="flex items-center gap-1.5"><FiCalendar className="text-warning" />
                        {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold border ${
                      assignedName ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {assignedName ? (
                        <><FiUserCheck className="w-4 h-4" /> {assignedName}</>
                      ) : (
                        <><FiUserX className="w-4 h-4" /> Not Assigned</>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    <button
                      onClick={() => setAssignModal(booking)}
                      className="btn-outline text-sm py-1.5 px-4 gap-1.5"
                    >
                      <FiUserCheck className="w-4 h-4" /> {assignedName ? 'Change' : 'Assign'}
                    </button>
                    {assignedName && (
                      <button
                        onClick={() => handleUnassignMediator(booking._id)}
                        className="text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <FiX className="w-4 h-4" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal: Promote User to Mediator ────────────────────── */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-elevated border border-border-light w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-border-light flex justify-between items-center">
              <h2 className="text-body-lg font-bold text-text-primary flex items-center gap-2">
                <FiPlusCircle className="text-accent" /> Promote User to Mediator
              </h2>
              <button onClick={() => setShowPromoteModal(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* User selector */}
              <div>
                <label className="form-label">Select User *</label>
                <div className="relative mb-2">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users…"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="form-input !pl-10 text-sm"
                  />
                </div>
                <div className="border border-border-default rounded-xl max-h-40 overflow-y-auto divide-y divide-border-light">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center py-4 text-text-muted text-sm">No users found.</p>
                  ) : filteredUsers.map(u => (
                    <button
                      key={u._id}
                      onClick={() => setPromoteUserId(u._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        promoteUserId === u._id ? 'bg-forest-50 border-l-2 border-primary' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Avatar src={u.photo} name={u.username} size={32} />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{u.username}</p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </div>
                      {promoteUserId === u._id && <FiCheck className="ml-auto text-primary w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Languages (comma-separated)</label>
                  <input type="text" value={promoteForm.languages} onChange={e => setPromoteForm(f => ({ ...f, languages: e.target.value }))} className="form-input text-sm" placeholder="English, Hindi" />
                </div>
                <div>
                  <label className="form-label">Cost per Hour (₹)</label>
                  <input type="number" value={promoteForm.costPerHour} onChange={e => setPromoteForm(f => ({ ...f, costPerHour: e.target.value }))} className="form-input text-sm" min="0" step="50" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="text" value={promoteForm.phone} onChange={e => setPromoteForm(f => ({ ...f, phone: e.target.value }))} className="form-input text-sm" />
                </div>
                <div>
                  <label className="form-label">Experience</label>
                  <input type="text" value={promoteForm.experience} onChange={e => setPromoteForm(f => ({ ...f, experience: e.target.value }))} className="form-input text-sm" placeholder="3 years" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Bio</label>
                  <textarea value={promoteForm.bio} onChange={e => setPromoteForm(f => ({ ...f, bio: e.target.value }))} className="form-input text-sm min-h-[70px] resize-none" placeholder="Short bio…" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border-light flex gap-3">
              <button onClick={handlePromote} disabled={isSaving || !promoteUserId} className="btn-cta flex-1 gap-2 justify-center disabled:opacity-50">
                <FiCheck className="w-4 h-4" /> {isSaving ? 'Promoting…' : 'Promote to Mediator'}
              </button>
              <button onClick={() => setShowPromoteModal(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Assign Mediator to Booking ──────────────────── */}
      {assignModal && (
        <div className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-elevated border border-border-light w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-border-light flex justify-between items-center">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <FiUserCheck className="text-accent" /> Assign Mediator
              </h2>
              <button onClick={() => setAssignModal(null)} className="text-text-muted hover:text-text-primary">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-text-secondary mb-4">
                Booking: <span className="font-bold text-primary">{assignModal.tourName}</span>
                {' '}· {assignModal.fullName}
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {mediators.filter(m => m.isAvailable).length === 0 && (
                  <p className="text-center py-4 text-text-muted text-sm">No available mediators.</p>
                )}
                {mediators.filter(m => m.isAvailable).map(med => {
                  const isCurrentlyAssigned = assignModal.mediatorId?.toString() === med._id?.toString();
                  return (
                    <button
                      key={med._id}
                      onClick={() => handleAssignMediator(assignModal._id, med._id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${
                        isCurrentlyAssigned
                          ? 'border-primary bg-forest-50'
                          : 'border-border-default hover:border-accent hover:bg-forest-50/50'
                      }`}
                    >
                      <Avatar src={med.userId?.photo} name={med.userId?.username} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-primary text-sm truncate">{med.userId?.username}</p>
                        <p className="text-xs text-text-muted truncate">{med.languages?.join(', ') || 'No languages'} · ₹{med.costPerHour}/hr</p>
                      </div>
                      {isCurrentlyAssigned && <FiCheck className="text-primary w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setAssignModal(null)} className="btn-ghost w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediatorManagement;