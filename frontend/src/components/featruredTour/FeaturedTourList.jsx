import React from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import TourCard from "../../shared/TourCard";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const FeaturedTourList = () => {
  const { apiData: featuredToursData, error, loading } = useFetch(
    `${BASE_URL}/tour/featured`
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-forest-200 border-t-accent rounded-full animate-spin" />
          <p className="text-body-sm text-text-muted">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error && !featuredToursData) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-body-lg font-bold text-text-primary mb-1">Unable to load tours</h4>
        <p className="text-body-sm text-text-secondary">Please try again later</p>
      </div>
    );
  }

  const hasTours = featuredToursData && featuredToursData.length > 0;

  return (
    <div className="space-y-10">
      {hasTours ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredToursData.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/tours" className="btn-cta-lg group">
              View All Tours
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-body-lg font-bold text-text-primary mb-1">No featured tours available</h4>
          <p className="text-body-sm text-text-secondary mb-6">Check back later for new tours</p>
          <Link to="/tours" className="btn-cta group">
            Browse All Tours
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedTourList;