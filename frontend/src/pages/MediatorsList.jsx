import React, { useEffect, useState } from 'react';
import BASE_URL from '../utils/config';
import { BiStar, BiMoney, BiGlobe, BiCheckCircle } from 'react-icons/bi';
import { toast } from 'react-toastify';

const MediatorsList = () => {
  const [mediators, setMediators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchMediators();
  }, []);

  const fetchMediators = async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator-profile/all-mediators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.success) {
        setMediators(result.data);
      }
    } catch (error) {
      console.error('Error fetching mediators:', error);
      toast.error('Failed to load mediators');
    } finally {
      setLoading(false);
    }
  };

  const filteredMediators = selectedFilter === 'all' 
    ? mediators 
    : mediators.filter(m => m.isAvailable);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading mediators...</div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Language Mediators</h1>
          <p className="text-gray-600">Browse and book professional language mediators for your trips</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Mediators ({mediators.length})
          </button>
          <button
            onClick={() => setSelectedFilter('available')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedFilter === 'available'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Available Now ({mediators.filter(m => m.isAvailable).length})
          </button>
        </div>

        {/* Mediators Grid */}
        {filteredMediators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMediators.map((mediator) => (
              <div key={mediator._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Availability Badge */}
                <div className={`px-4 py-2 ${mediator.isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <p className={`text-sm font-semibold ${mediator.isAvailable ? 'text-green-700' : 'text-gray-700'}`}>
                    {mediator.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <BiStar className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-gray-900">{(mediator.rating || 0).toFixed(1)}</span>
                    <span className="text-gray-600 text-sm">({mediator.reviews?.length || 0} reviews)</span>
                  </div>

                  {/* Hourly Rate */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <BiMoney className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Hourly Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">Rs. {mediator.costPerHour || 0}<span className="text-sm text-gray-600">/hr</span></p>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BiGlobe className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mediator.languages && mediator.languages.length > 0 ? (
                        mediator.languages.map((lang, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No languages specified</span>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  {mediator.experience && (
                    <div className="mb-4 text-sm">
                      <p className="font-semibold text-gray-700 mb-1">Experience</p>
                      <p className="text-gray-600 line-clamp-2">{mediator.experience}</p>
                    </div>
                  )}

                  {/* Bio */}
                  {mediator.bio && (
                    <div className="mb-4 text-sm">
                      <p className="font-semibold text-gray-700 mb-1">Bio</p>
                      <p className="text-gray-600 line-clamp-2">{mediator.bio}</p>
                    </div>
                  )}

                  {/* Bookings Count */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BiCheckCircle className="w-4 h-4 text-green-600" />
                      <span>{mediator.totalBookings || 0} completed bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No mediators available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediatorsList;
