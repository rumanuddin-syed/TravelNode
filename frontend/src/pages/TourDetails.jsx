import React, { useContext, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import BASE_URL from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import CalculateAvg from "../utils/CalculateAvg";
import Booking from "../components/Booking/Booking";
import TourTripPlanner from "../components/TourTripPlanner/TourTripPlanner";
import RouteMap from "../components/Map/RouteMap";
import { FaStar, FaMapMarkerAlt, FaRegClock, FaMoneyBillWave } from "react-icons/fa";
import { FiUsers, FiMap, FiMessageCircle } from "react-icons/fi";

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const [plannerVisible, setPlannerVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const {
    apiData: tour,
    loading,
    error,
    refetch,
  } = useFetch(`${BASE_URL}/tour/${id}`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-forest-200 border-t-accent rounded-full animate-spin" />
          <p className="text-body-lg font-medium text-text-muted">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-background pt-20 text-center">
        <div>
          <div className="w-20 h-20 mx-auto bg-red-50 rounded-3xl flex items-center justify-center mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-display-sm text-text-primary mb-2">Tour Not Found</h2>
          <p className="text-body-lg text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!tour) return null;

  const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize } = tour;
  const { totalRating, avgRating } = CalculateAvg(reviews);

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      toast.error("Please sign in to submit a review");
      return;
    }
    if (!tourRating || !reviewText) {
      toast.error("Please provide a rating and a review message");
      return;
    }

    try {
      const reviewObj = {
        productId: id,
        username: user.username,
        reviewText,
        rating: tourRating,
      };

      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Keep it identical functional wise
        },
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message);
      }
      toast.success(result.message);
      reviewMsgRef.current.value = "";
      setTourRating(null);
      refetch();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleTogglePlanner = () => {
    setPlannerVisible(!plannerVisible);
    setTimeout(() => {
      document.getElementById('planner-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img src={photo} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-5 lg:px-8 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge bg-cta/20 text-cta border border-cta/30 backdrop-blur-md">
              <FaMapMarkerAlt className="mr-1" /> {city}
            </span>
            <span className="badge bg-white/20 text-white border border-white/30 backdrop-blur-md">
              <FaStar className="mr-1 text-warning" /> {avgRating === 0 ? "New" : avgRating}
            </span>
          </div>
          <h1 className="text-display-md lg:text-display-lg text-white font-bold mb-4 max-w-3xl leading-tight">
            {title}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview Card */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-border-light pb-6 mb-6">
                <h2 className="text-display-sm">Overview</h2>
                <button
                  onClick={handleTogglePlanner}
                  className="btn bg-accent/10 text-primary hover:bg-accent/20 text-body-sm"
                >
                  <FiMap className="w-4 h-4 mr-1.5" />
                  {plannerVisible ? "Hide Trip Planner" : "Try AI Trip Planner"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-body-sm">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-text-muted"><FaMoneyBillWave className="text-accent" /> Price</p>
                  <p className="font-bold text-text-primary">₹{price} / person</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-text-muted"><FiUsers className="text-accent" /> Max Group</p>
                  <p className="font-bold text-text-primary">{maxGroupSize} People</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-text-muted"><FaRegClock className="text-accent" /> Distance</p>
                  <p className="font-bold text-text-primary">{distance} km</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-text-muted"><FaStar className="text-warning" /> Rating</p>
                  <p className="font-bold text-text-primary">{avgRating} ({reviews?.length} Reviews)</p>
                </div>
              </div>

              <div className="prose prose-forest max-w-none text-text-secondary leading-relaxed">
                <p>{desc}</p>
              </div>

              {/* Map embedded */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-border-light">
                <RouteMap destination={address} />
              </div>
            </div>

            {/* AI Trip Planner Section */}
            {plannerVisible && (
              <div id="planner-section" className="animate-fade-in scroll-mt-24">
                <div className="bg-gradient-forest rounded-2xl p-1 mb-10 shadow-elevated">
                  <div className="bg-surface rounded-xl overflow-hidden h-full">
                    <TourTripPlanner tour={tour} />
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="card p-6 md:p-8">
              <h2 className="text-display-sm mb-6 flex items-center gap-2">
                <FiMessageCircle className="text-accent" /> Reviews ({reviews?.length})
              </h2>

              {/* Write Review */}
              <div className="bg-forest-50 rounded-2xl p-6 mb-8">
                <h4 className="font-semibold text-text-primary mb-4 text-body-md">Leave a Review</h4>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setTourRating(num)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <FaStar className={`w-6 h-6 ${tourRating >= num ? "text-warning" : "text-border-default"}`} />
                    </button>
                  ))}
                  <span className="text-caption text-text-muted ml-2 font-medium">Select Rating</span>
                </div>
                
                <form onSubmit={submitHandler} className="relative">
                  <textarea
                    ref={reviewMsgRef}
                    className="form-textarea w-full pl-4 pr-32 py-3"
                    placeholder="Share your thoughts about this tour..."
                    rows="3"
                  />
                  <button type="submit" className="absolute right-3 top-3 bottom-auto btn-cta !py-2 !px-4">
                    Submit
                  </button>
                </form>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews?.slice()?.reverse()?.map((review, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-border-light pb-6 last:border-0 last:pb-0">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-primary">
                      {review.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-bold text-text-primary text-body-md">{review.username}</h5>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                          <FaStar className="w-3 h-3 text-warning" />
                          <span className="text-caption font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-text-secondary text-body-sm leading-relaxed">{review.reviewText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 border-l">
            <div className="sticky top-24">
              <Booking tour={tour} avgRating={avgRating} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourDetails;