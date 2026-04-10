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
    <div className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-display-sm text-text-primary mb-2">Manage Tours</h2>
          <p className="text-body-sm text-text-secondary">View, edit, or delete existing tours.</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-forest-50 border-b border-border-light table-header">
                <tr>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Photo</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Title</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">City</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Featured</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Max People</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Reviews</th>
                  <th className="px-5 py-4 text-left text-caption font-bold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {tours?.map((tour) => (
                  <AdminToursCards tour={tour} key={tour._id} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 py-6 bg-white border-t border-border-light">
              {[...Array(pageCount).keys()].map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                    page === number
                      ? "bg-primary text-white shadow-sm"
                      : "bg-forest-50 text-text-secondary hover:bg-forest-100 hover:text-primary"
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