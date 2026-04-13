import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiDollarSign, FiUsers, FiMap, FiActivity, FiBriefcase } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors mapping for the Forest and Sky design system
  const COLORS = ['#40916C', '#4CC9F0', '#E9C46A', '#E76F51', '#2D6A4F', '#90E4F7'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BASE_URL}/analytics/admin`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch analytics.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Network error loading analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-background">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!data) return null;

  // Custom tooltips
  const CustomRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-border-light rounded-xl shadow-card">
          <p className="font-bold text-text-primary mb-1">{label}</p>
          <p className="text-primary font-semibold">Revenue: ₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBookingTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-border-light rounded-xl shadow-card">
          <p className="font-bold text-text-primary mb-1">{label}</p>
          <p className="text-cta font-semibold">Bookings: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background min-h-screen py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="section-overline">Platform Insights</span>
          <h1 className="text-display-md text-text-primary mt-2 flex items-center justify-center md:justify-start gap-3">
            <FiActivity className="text-accent" /> Analytics Dashboard
          </h1>
          <p className="text-body-sm text-text-secondary mt-2">Interactive trends and advanced platform performance mapping.</p>
        </div>

        {/* 1. Revenue Analytics */}
        <div className="mb-10">
          <h2 className="text-body-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FiDollarSign className="text-cta" /> Revenue Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="card p-6 bg-gradient-to-br from-white to-sky-50 border-sky-100 hover:shadow-cta transition-shadow">
                <p className="text-caption text-sky-800 font-bold uppercase tracking-wider mb-2">Total System Revenue</p>
                <div className="text-4xl font-bold text-sky-600">₹{data.revenueAnalytics?.totalRevenue?.toLocaleString()}</div>
                <p className="text-sm text-sky-700/70 mt-2">All paid bookings</p>
             </div>
             
             <div className="card p-6 bg-gradient-to-br from-white to-amber-50 border-amber-100 hover:shadow-card-hover transition-shadow">
                <p className="text-caption text-amber-800 font-bold uppercase tracking-wider mb-2">Total Mediator Payouts</p>
                <div className="text-4xl font-bold text-amber-600">₹{data.revenueAnalytics?.totalMediatorPayouts?.toLocaleString()}</div>
                <p className="text-sm text-amber-700/70 mt-2">95% of mediator fees</p>
             </div>

             <div className="card p-6 bg-gradient-to-br from-white to-forest-50 border-forest-100 ring-2 ring-forest-200 hover:shadow-elevated transition-shadow">
                <p className="text-caption text-forest-800 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiTrendingUp /> Platform Profit
                </p>
                <div className="text-4xl font-bold text-forest-700">₹{data.revenueAnalytics?.platformProfit?.toLocaleString()}</div>
                <p className="text-sm text-forest-800/70 mt-2">Full Tour Revenue + 5% Admin Commission</p>
             </div>
          </div>
        </div>

        {/* 2. Interactive Trends Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
           
           {/* Line Chart */}
           <div className="card p-6 shadow-sm overflow-hidden bg-white">
             <h2 className="text-body-lg font-bold text-text-primary mb-6 flex items-center gap-2">
               <FiTrendingUp className="text-primary" /> Revenue Growth Over Time
             </h2>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#40916C" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#40916C" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" tick={{fill: '#52796F', fontSize: 12}} axisLine={false} tickLine={false} />
                   <YAxis tick={{fill: '#52796F', fontSize: 12}} axisLine={false} tickLine={false}  tickFormatter={(val) => `₹${val/1000}k`} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D8F3DC" />
                   <Tooltip content={<CustomRevenueTooltip />} />
                   <Area type="monotone" dataKey="revenue" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* Bar Chart */}
           <div className="card p-6 shadow-sm overflow-hidden bg-white">
             <h2 className="text-body-lg font-bold text-text-primary mb-6 flex items-center gap-2">
               <FiUsers className="text-cta" /> Bookings Volume Timeline
             </h2>
             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <XAxis dataKey="name" tick={{fill: '#52796F', fontSize: 12}} axisLine={false} tickLine={false} />
                   <YAxis allowDecimals={false} tick={{fill: '#52796F', fontSize: 12}} axisLine={false} tickLine={false} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8FAFE" />
                   <Tooltip content={<CustomBookingTooltip />} cursor={{fill: '#F0FFF4'}} />
                   <Bar dataKey="bookings" fill="#4CC9F0" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
           
           {/* Tour Donut Chart */}
           <div className="card p-6 shadow-sm flex flex-col bg-white">
             <h2 className="text-body-lg font-bold text-text-primary mb-2 flex items-center gap-2">
               <FiMap className="text-sky-500" /> Tour Booking Distribution
             </h2>
             {data.bookingInsights?.popularTours?.length > 0 ? (
               <div className="h-72 w-full mt-4 flex items-center justify-center relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={data.bookingInsights.popularTours}
                       cx="50%"
                       cy="50%"
                       innerRadius={65}
                       outerRadius={95}
                       paddingAngle={3}
                       dataKey="count"
                     >
                       {data.bookingInsights.popularTours.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                        formatter={(value, name) => [`${value} bookings`, name]} 
                     />
                     <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#081C15', paddingTop: '20px' }} />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-text-primary">{data.bookingInsights.totalBookings}</span>
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Total</span>
                 </div>
               </div>
             ) : (
                <p className="text-text-muted italic text-center py-10">No popular tours data available.</p>
             )}
           </div>

           {/* Mediator Insights  */}
           <div className="card p-6 shadow-sm bg-white">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-body-lg font-bold text-text-primary flex items-center gap-2">
                  <FiBriefcase className="text-amber-500" /> Top Performer Mediators
                </h2>
                <div className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full text-text-secondary">
                   Total Active: {data.mediatorInsights?.totalMediators}
                </div>
             </div>
             
             {data.mediatorInsights?.topMediators?.length > 0 ? (
               <div className="space-y-4">
                 {data.mediatorInsights.topMediators.map((med, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 hover:bg-forest-50 border border-transparent hover:border-forest-100 rounded-xl transition-all cursor-default">
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                         #{idx + 1}
                       </div>
                       <div>
                         <p className="font-bold text-text-primary text-base">{med.name}</p>
                         <p className="text-xs text-text-muted">{med.trips} trips completed</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">Net Payout</p>
                       <p className="font-bold text-primary text-lg">₹{med.earnings.toLocaleString()}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-text-muted italic text-center py-10">No mediator data available.</p>
             )}
           </div>
        </div>

      </div>
    </div>
  )
}

export default AdminAnalytics;
