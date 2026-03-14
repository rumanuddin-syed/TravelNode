import React from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import TourCard from "../../shared/TourCard";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const FeaturedTourList = () => {
  const { apiData: featuredToursData, error, loading } = useFetch(
    `${BASE_URL}/tour/featured`
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !featuredToursData) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">Unable to load featured tours</h4>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  // Check if we have tours to display
  const hasTours = featuredToursData && featuredToursData.length > 0;

  return (
    <div className="space-y-8">
      {hasTours ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredToursData.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/tours"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <span>View All Tours</span>
              <BsArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">No featured tours available</h4>
          <p className="text-gray-600 mb-6">Check back later for new featured tours</p>
          <Link
            to="/tours"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            <span>Browse All Tours</span>
            <BsArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedTourList;