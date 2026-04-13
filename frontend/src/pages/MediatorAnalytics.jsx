import React, { useEffect, useState } from 'react';
import BASE_URL from '../utils/config';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiDollarSign, FiActivity, FiMap, FiClock, FiCheckCircle } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const MediatorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#4CC9F0', '#40916C', '#E9C46A', '#E76F51', '#2A9ABF'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BASE_URL}/analytics/mediator`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch mediator analytics.');
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
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!data) return null;

  const CustomEarningsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-border-light rounded-xl shadow-card">
          <p className="font-bold text-text-primary mb-1">{label}</p>
          <p className="text-forest-600 font-bold">Net Earnings: ₹{payload[0].value.toLocaleString()}</p>
          <p className="text-text-muted text-xs mt-1">Platform fee deducted</p>
        </div>
      );
    }
    return null;
  };

  // Prepare trip distribution data for Pie Chart
  const tripDistributionData = [
    { name: 'Completed Trips', value: data.tripPerformance?.completedTrips || 0, color: '#40916C' },
    { name: 'Upcoming Trips', value: data.tripPerformance?.upcomingTrips || 0, color: '#4CC9F0' },
  ].filter(item => item.value > 0);

  return (
    <div className="py-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-display-sm text-text-primary flex items-center gap-2">
          <FiActivity className="text-accent" /> Your Analytics & Insights
        </h2>
        <p className="text-body-sm text-text-secondary mt-1">Track your earnings, trips, and performance over time.</p>
      </div>

      {/* 1. Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 bg-gradient-to-br from-white to-forest-50 border-forest-100 ring-2 ring-forest-200 shadow-sm relative overflow-hidden transition-shadow hover:shadow-elevated">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-forest-200/50 rounded-full blur-xl pointer-events-none"></div>
          <p className="text-caption text-forest-800 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <FiDollarSign /> Net Earnings
          </p>
          <div className="text-4xl font-bold text-forest-700">₹{data.earningsSummary?.totalNetEarnings?.toLocaleString()}</div>
          <p className="text-sm text-forest-800/70 mt-2 font-semibold">Take-home pay (95% of your fee)</p>
        </div>

        <div className="card p-6 border-border-light bg-gray-50/50 flex flex-col justify-center transition-shadow hover:shadow-md">
          <p className="text-caption text-text-muted font-bold uppercase tracking-wider mb-2">Platform Deduction</p>
          <div className="text-2xl font-bold text-red-500">-₹{data.earningsSummary?.platformFeeDeducted?.toLocaleString()}</div>
          <p className="text-xs text-text-muted mt-1">5% Admin platform fee</p>
        </div>

        <div className="card p-6 border-border-light bg-gray-50/50 flex flex-col justify-center transition-shadow hover:shadow-md">
          <p className="text-caption text-text-muted font-bold uppercase tracking-wider mb-2">Gross Fee Generated</p>
          <div className="text-2xl font-bold text-text-primary">₹{data.earningsSummary?.grossFee?.toLocaleString()}</div>
          <p className="text-xs text-text-muted mt-1">Total value assigned to you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* 2. Monthly Trends (Recharts Area) */}
        <div className="card p-6 shadow-sm bg-white overflow-hidden">
          <h3 className="text-body-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-primary" /> Monthly Net Earnings
          </h3>
          {data.monthlyTrends && data.monthlyTrends.length > 0 ? (
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#40916C" stopOpacity={0.6}/>
                       <stop offset="95%" stopColor="#40916C" stopOpacity={0.05}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" tick={{fill: '#52796F', fontSize: 12}} axisLine={false} tickLine={false} />
                   <YAxis tick={{fill: '#52796F', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8FAFE" />
                   <Tooltip content={<CustomEarningsTooltip />} />
                   <Area type="monotone" dataKey="earnings" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          ) : (
             <p className="text-text-muted italic text-center py-10">No monthly data available yet.</p>
          )}
        </div>

        {/* 3. Trip Performance & Popular Tours */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 shadow-sm bg-white">
             <h3 className="text-body-lg font-bold text-text-primary mb-4">Trip Distribution</h3>
             <div className="flex items-center">
                {tripDistributionData.length > 0 ? (
                  <div className="h-44 w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tripDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {tripDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-text-muted text-sm italic w-1/2">No trips recorded.</p>
                )}
                <div className="w-1/2 flex flex-col gap-3 pl-4 border-l border-border-light">
                   <div className="flex items-center gap-2 text-sm text-text-primary font-semibold">
                      <div className="w-3 h-3 rounded-full bg-forest-600"></div> Completed: {data.tripPerformance?.completedTrips || 0}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-text-primary font-semibold">
                      <div className="w-3 h-3 rounded-full bg-sky-400"></div> Upcoming: {data.tripPerformance?.upcomingTrips || 0}
                   </div>
                   <div className="mt-2 text-xs text-text-muted border-t border-border-light pt-2">
                       Total Handled: <span className="font-bold text-text-primary">{data.tripPerformance?.totalTrips}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="card p-6 shadow-sm flex-1 bg-white">
             <h3 className="text-body-lg font-bold text-text-primary mb-4 flex items-center gap-2">
               <FiMap className="text-amber-500" /> Most Assigned Tours
             </h3>
             {data.popularTours?.length > 0 ? (
               <div className="space-y-3">
                 {data.popularTours.slice(0,3).map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 hover:bg-amber-50 p-3 rounded-lg border border-gray-100 transition-colors">
                      <p className="font-semibold text-sm text-text-primary">{t.name}</p>
                      <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">
                        {t.count} trips
                      </div>
                    </div>
                 ))}
               </div>
             ) : (
                <p className="text-text-muted text-sm italic">No tour data available yet.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediatorAnalytics;
