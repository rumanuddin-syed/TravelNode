import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import AdminToursCards from "../../shared/AdminToursCards";

const AdminTours = () => {
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
    <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Photo</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">City</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Featured</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Max People</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Reviews</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tours?.map((tour) => (
                  <AdminToursCards tour={tour} key={tour._id} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 py-6 bg-white border-t border-gray-100">
              {[...Array(pageCount).keys()].map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                    page === number
                      ? "bg-gradient-to-r from-BaseColor to-BHoverColor text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTours;