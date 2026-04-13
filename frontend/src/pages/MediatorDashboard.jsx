import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../utils/config';
import { toast } from 'react-toastify';
import { FiDollarSign, FiClock, FiCalendar, FiCheckCircle, FiActivity } from 'react-icons/fi';
import MediatorAnalytics from './MediatorAnalytics';

const MediatorDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingBookings: 0,
        completedSessions: 0,
        totalHours: 0
    });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user?._id) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(`${BASE_URL}/mediator-profile/stats/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await res.json();

            if (result.success) {
                setStats(result.data.stats);
                setBookings(result.data.recentBookings);
            }
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/mediator-profile/booking/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            const result = await res.json();
            if (result.success) {
                toast.success('Status updated successfully');
                fetchDashboardData();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <section className="bg-background min-h-[80vh] py-16">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <div className="mb-10">
                    <span className="section-overline">Workspace</span>
                    <h2 className="text-display-sm text-text-primary mt-1 flex items-center justify-between">
                       Mediator Dashboard
                    </h2>
                    
                    <div className="flex gap-4 mt-6 border-b border-border-light">
                       <button 
                         className={`pb-3 px-2 font-semibold transition-colors border-b-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                         onClick={() => setActiveTab('overview')}
                       >
                         Overview & Bookings
                       </button>
                       <button 
                         className={`pb-3 px-2 font-semibold transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                         onClick={() => setActiveTab('analytics')}
                       >
                         <FiActivity /> Analytics
                       </button>
                    </div>
                </div>

                {activeTab === 'analytics' ? (
                   <MediatorAnalytics />
                ) : (
                <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    <div className="card p-6 border-l-4 border-l-cta">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Total Earnings</p>
                                <h3 className="text-display-sm font-bold text-primary mt-1">₹{stats.totalEarnings}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-cta">
                                <FiDollarSign className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="card p-6 border-l-4 border-l-warning">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Pending Bookings</p>
                                <h3 className="text-display-sm font-bold text-primary mt-1">{stats.pendingBookings}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                <FiCalendar className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 border-l-4 border-l-success">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Completed Sessions</p>
                                <h3 className="text-display-sm font-bold text-primary mt-1">{stats.completedSessions}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center text-success">
                                <FiCheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 border-l-4 border-l-accent">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Total Hours</p>
                                <h3 className="text-display-sm font-bold text-primary mt-1">{stats.totalHours}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center text-accent">
                                <FiClock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="card overflow-hidden">
                    <div className="px-6 py-5 border-b border-border-light bg-forest-50 flex items-center justify-between">
                        <h3 className="text-body-lg font-bold text-primary">Recent Bookings</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-light bg-white text-caption font-bold text-text-muted uppercase tracking-wider">
                                    <th className="px-6 py-4">Tour / Date</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Hours</th>
                                    <th className="px-6 py-4">Earnings</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-text-secondary text-body-sm">
                                            No recent bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id} className="border-b border-border-light hover:bg-forest-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-text-primary mb-1">{booking.tourName}</p>
                                                <p className="text-xs text-text-muted">
                                                    {booking.startDate} - {booking.endDate}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-text-primary">{booking.fullName}</p>
                                                <p className="text-xs text-text-muted">{booking.phone}</p>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary font-medium">
                                                {booking.hours} hrs
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary">
                                                ₹{booking.mediatorEarnings}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                                    ${booking.status === 'completed' ? 'bg-forest-100 text-forest-800' : 
                                                      booking.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                                      'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                                        className="btn-secondary !px-4 !py-1.5 !text-xs"
                                                    >
                                                        Mark Done
                                                    </button>
                                                )}
                                                {booking.status === 'completed' && (
                                                    <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                                                        <FiCheckCircle className="text-success" /> Done
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
                )}
            </div>
        </section>
    );
};

export default MediatorDashboard;