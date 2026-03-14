import React, { useEffect, useState } from "react";
import FeaturedTourList from "../components/featruredTour/FeaturedTourList";
import useFetch from "../hooks/useFetch";
import BASE_URL from "../utils/config";
import TourCard from "../shared/TourCard";
import SearchTours from "../components/Search/SearchTours";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const { apiData: tours, error } = useFetch(`${BASE_URL}/tour?page=${page}`);
  const { apiData: tourCount } = useFetch(`${BASE_URL}/tour/count`);

  useEffect(() => {
    const pages = Math.ceil(tourCount / 12);
    setPageCount(pages);
    window.scrollTo(0, 0);
  }, [page, tourCount, tours]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchTours />
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tours?.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {[...Array(pageCount).keys()].map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                  page === number
                    ? "bg-gradient-to-r from-BaseColor to-BHoverColor text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Tours;