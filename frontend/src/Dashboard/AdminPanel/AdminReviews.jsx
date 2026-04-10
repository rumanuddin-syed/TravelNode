import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import { FiStar, FiTrash2, FiSearch, FiMessageSquare, FiEdit, FiX, FiCheck, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import Modal from "react-modal";

const AdminReviews = () => {
  const { apiData, loading, error } = useFetch(`${BASE_URL}/review`);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit State
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    reviewText: "",
    rating: 5
  });

  useEffect(() => {
    if (apiData) {
      setReviews(apiData);
    }
    Modal.setAppElement('#root');
  }, [apiData]);

  const handleToggleStar = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/review/${id}/star`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message);
      }
      toast.success(result.message);
      setReviews(reviews.map(r => r._id === id ? { ...r, isStarred: !currentStatus } : r));
    } catch (err) {
      toast.error("Failed to toggle star status");
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditFormData({
      username: review.username,
      reviewText: review.reviewText,
      rating: review.rating
    });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/review/${editingReview._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData)
      });
      
      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message);
      }
      
      toast.success("Review updated successfully");
      setReviews(reviews.map(r => r._id === editingReview._id ? { ...r, ...editFormData } : r));
      setEditingReview(null);
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message);
      }
      toast.success("Review deleted successfully");
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((r.productId?.title || r.tourId?.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="section-overline">Management</span>
          <h1 className="text-display-md text-text-primary mt-2">All Reviews</h1>
          <p className="text-body-sm text-text-secondary mt-2">
            Moderate, edit, or star ⭐ reviews for your homepage testimonials.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews or tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11 shadow-sm w-full"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-3 border-forest-200 border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h4 className="text-body-lg font-bold text-text-primary mb-1">Unable to load reviews</h4>
          <p className="text-body-sm text-text-secondary">{error}</p>
        </div>
      )}

      {!loading && !error && filteredReviews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-border-light">
          <div className="w-16 h-16 mx-auto bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
            <FiMessageSquare className="w-8 h-8 text-accent" />
          </div>
          <h4 className="text-body-lg font-bold text-text-primary mb-1">No reviews found</h4>
          <p className="text-body-sm text-text-secondary">It's quiet in here.</p>
        </div>
      )}

      {!loading && !error && filteredReviews.length > 0 && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-forest-50/50 border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-caption font-bold text-text-secondary">USER & RATING</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-secondary">TOUR</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-secondary">CONTENT</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-secondary">FEATURED</th>
                  <th className="px-6 py-4 text-right text-caption font-bold text-text-secondary">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredReviews.map((review) => {
                  const tour = review.productId || review.tourId;
                  return (
                    <tr key={review._id} className="hover:bg-forest-50/30 transition-colors">
                      <td className="px-6 py-4 flex flex-col gap-1 w-48">
                        <span className="text-body-sm font-bold text-text-primary">{review.username}</span>
                        <div className="flex items-center text-warning text-sm font-semibold">
                          {review.rating} <FiStar className="ml-1 w-3.5 h-3.5 fill-warning" />
                        </div>
                      </td>
                      <td className="px-6 py-4 w-52">
                        {tour ? (
                          <>
                            <p className="text-body-sm font-semibold text-text-primary line-clamp-1">{tour.title}</p>
                            <p className="text-caption text-text-muted line-clamp-1">{tour.city}</p>
                          </>
                        ) : (
                          <span className="text-text-muted text-caption italic">Legacy/Deleted</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-body-sm text-text-secondary leading-relaxed line-clamp-2 max-w-md italic">
                          "{review.reviewText}"
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStar(review._id, review.isStarred)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                            review.isStarred 
                              ? 'bg-amber-100 text-amber-500 shadow-inner' 
                              : 'bg-forest-50 text-text-muted hover:bg-forest-100 border border-transparent hover:border-amber-200'
                          }`}
                          title={review.isStarred ? "Remove from Homepage" : "Feature on Homepage"}
                        >
                          <FiStar className={`w-5 h-5 ${review.isStarred ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-forest-50 text-accent hover:bg-forest-100 transition-colors"
                            title="Edit Review"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-danger hover:bg-red-100 transition-colors"
                            title="Delete Review"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editingReview !== null}
        onRequestClose={() => setEditingReview(null)}
        className="fixed inset-0 flex items-center justify-center z-[100] outline-none"
        overlayClassName="fixed inset-0 bg-forest-900/60 backdrop-blur-sm z-[99]"
      >
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h4 font-bold text-text-primary">Edit Review</h2>
            <button onClick={() => setEditingReview(null)} className="p-2 hover:bg-forest-50 rounded-xl transition-colors">
              <FiX className="w-6 h-6 text-text-muted" />
            </button>
          </div>

          <form onSubmit={handleUpdateReview} className="space-y-5">
            <div>
              <label className="block text-caption font-bold text-text-secondary uppercase mb-2">Reviewer Name</label>
              <input
                type="text"
                className="input-field w-full"
                value={editFormData.username}
                onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-caption font-bold text-text-secondary uppercase mb-2">Rating (1-5)</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEditFormData({...editFormData, rating: num})}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      editFormData.rating >= num 
                        ? 'bg-warning text-white shadow-md' 
                        : 'bg-forest-50 text-text-muted hover:bg-forest-100'
                    }`}
                  >
                    <FiStar className={`w-5 h-5 ${editFormData.rating >= num ? 'fill-white' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-caption font-bold text-text-secondary uppercase mb-2">Review Content</label>
              <textarea
                className="input-field w-full min-h-[120px] py-3 resize-none"
                value={editFormData.reviewText}
                onChange={(e) => setEditFormData({...editFormData, reviewText: e.target.value})}
                required
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="btn-cta w-full py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                <FiSave className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReviews;
