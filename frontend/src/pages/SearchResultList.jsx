import React, { useState } from "react";
import TourCard from "../shared/TourCard";
import SearchTours from "../components/Search/SearchTours";
import { useLocation } from "react-router-dom";

const SearchResultList = () => {
  const location = useLocation();
  const [data] = useState(location.state);

  return (
    <>
      <section className="bg-forest-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <h1 className="text-display-md text-white mb-4">Tour Search Result</h1>
          <p className="text-body-lg text-forest-200 max-w-2xl mx-auto">
            Find the best match for your next adventure.
          </p>
        </div>
      </section>

      <SearchTours />

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[40vh]">
        {data.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h4 className="text-body-lg font-bold text-text-primary mb-1">No tours found</h4>
            <p className="text-body-sm text-text-secondary">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default SearchResultList;