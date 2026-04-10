import React, { useState, useEffect } from "react";
import TourCard from "../shared/TourCard";
import SearchTours from "../components/Search/SearchTours";
import useFetch from "../hooks/useFetch";
import BASE_URL from "../utils/config";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  const {
    apiData: toursData,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tour?page=${page}`);
  const { apiData: tourCount } = useFetch(`${BASE_URL}/tour/count`);

  useEffect(() => {
    const pages = Math.ceil(tourCount / 12);
    setPageCount(pages);
    window.scrollTo(0, 0);
  }, [page, tourCount, toursData]);

  return (
    <>
      <section className="bg-forest-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <h1 className="text-display-md text-white mb-4">All Tours</h1>
          <p className="text-body-lg text-forest-200 max-w-2xl mx-auto">
            Explore our complete collection of handcrafted travel experiences across the globe.
          </p>
        </div>
      </section>

      <SearchTours />

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[50vh]">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-forest-200 border-t-accent rounded-full animate-spin" />
              <p className="text-body-sm text-text-muted">Loading tours...</p>
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h4 className="text-body-lg font-bold text-text-primary mb-1">Unable to load tours</h4>
            <p className="text-body-sm text-text-secondary">{error}</p>
          </div>
        )}

        {!loading && !error && toursData?.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h4 className="text-body-lg font-bold text-text-primary mb-1">No tours found</h4>
            <p className="text-body-sm text-text-secondary">Try adjusting your search criteria</p>
          </div>
        )}

        {!loading && !error && toursData?.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {toursData.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-2">
                {[...Array(pageCount).keys()].map((number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                      page === number
                        ? "bg-accent text-white shadow-sm"
                        : "bg-forest-50 text-forest-700 hover:bg-forest-100"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Tours;