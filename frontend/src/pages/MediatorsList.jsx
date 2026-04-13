import React, { useEffect, useState } from 'react';
import BASE_URL from '../utils/config';
import { BiStar, BiMoney, BiGlobe, BiCheckCircle } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { FiDollarSign, FiStar, FiGlobe, FiCheckCircle } from 'react-icons/fi';

const MediatorsList = () => {
  const [mediators, setMediators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
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
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <section className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-forest-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <span className="section-overline !text-forest-200">Our Experts</span>
          <h1 className="text-display-md text-white mt-2 mb-4">Available Language Mediators</h1>
          <p className="text-body-lg text-forest-200 max-w-2xl mx-auto">
            Browse and book professional language mediators for your trips.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 -mt-8 relative z-20">
        <div className="card-elevated p-4 flex flex-wrap gap-3 w-fit mx-auto shadow-elevated mb-12">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-6 py-2 rounded-xl text-body-sm font-semibold transition-all duration-300 ${
              selectedFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-text-secondary hover:bg-forest-50 hover:text-primary'
            }`}
          >
            All Mediators ({mediators.length})
          </button>
          <button
            onClick={() => setSelectedFilter('available')}
            className={`px-6 py-2 rounded-xl text-body-sm font-semibold transition-all duration-300 ${
              selectedFilter === 'available'
                ? 'bg-success text-white shadow-sm'
                : 'bg-white text-text-secondary hover:bg-forest-50 hover:text-primary'
            }`}
          >
            Available Now ({mediators.filter(m => m.isAvailable).length})
          </button>
        </div>

        {filteredMediators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMediators.map((mediator) => (
              <div key={mediator._id} className="card overflow-hidden card-hover group">
                <div className={`px-5 py-3 border-b border-border-light flex justify-between items-center ${mediator.isAvailable ? 'bg-forest-50/50' : 'bg-gray-50'}`}>
                  <h3 className="font-bold text-text-primary">
                    {mediator.userId?.username || "Mediator"}
                  </h3>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    mediator.isAvailable ? 'bg-forest-100 text-forest-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${mediator.isAvailable ? 'bg-success' : 'bg-gray-500'}`} />
                    {mediator.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div className="p-6">
                  {/* Rating */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                      <FiStar className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-bold text-primary">{(mediator.rating || 0).toFixed(1)}</span>
                      <span className="text-caption text-text-muted">({mediator.reviews?.length || 0})</span>
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div className="mb-5 p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FiDollarSign className="w-5 h-5 text-cta" />
                      <span className="text-caption font-bold text-text-muted uppercase tracking-wide">Hourly Rate</span>
                    </div>
                    <p className="text-display-sm font-bold text-sky-900">
                      ₹{mediator.costPerHour || 0}<span className="text-body-sm text-sky-700 font-medium">/hr</span>
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <FiGlobe className="w-4 h-4 text-accent" />
                      <span className="text-caption font-bold text-text-muted uppercase tracking-wide">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mediator.languages && mediator.languages.length > 0 ? (
                        mediator.languages.map((lang, idx) => (
                          <span key={idx} className="badge bg-forest-50 text-forest-700 border border-border-default">
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className="text-caption text-text-muted italic">No languages specified</span>
                      )}
                    </div>
                  </div>

                  {/* Bio/Experience preview */}
                  {(mediator.bio || mediator.experience) && (
                    <div className="mb-5">
                      <p className="text-body-sm text-text-secondary line-clamp-2 leading-relaxed">
                        {mediator.bio || mediator.experience}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border-light mt-auto">
                    <div className="flex items-center gap-2 text-caption font-semibold text-text-secondary">
                      <FiCheckCircle className="w-4 h-4 text-success" />
                      <span>{mediator.totalBookings || 0} completed bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-forest-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🗣️</span>
            </div>
            <h3 className="text-body-lg font-bold text-text-primary mb-2">No mediators found</h3>
            <p className="text-body-sm text-text-secondary">There are currently no language mediators matching your filter criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediatorsList;
