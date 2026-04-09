import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import avatar from "../assets/images/avatar.jpg";
import { FaPeopleGroup, FaLocationDot } from "react-icons/fa6";
import { FaStar, FaMapPin, FaCity, FaDollarSign } from "react-icons/fa";
import CalculateAvg from "../utils/CalculateAvg";
import Booking from "../components/Booking/Booking";
import TourTripPlanner from "../components/TourTripPlanner/TourTripPlanner";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";
import BASE_URL from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const TourDetails = () => {
  const { user } = useContext(AuthContext);
  const reviewMsgRef = useRef();
  const [tourRating, setTourRating] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { apiData: tour, error } = useFetch(`${BASE_URL}/tour/${id}`);
  const {
    title = "",
    photo = "",
    desc = "",
    price = "",
    reviews = [],
    city = "",
    distance = "",
    maxGroupSize = "",
    address = "",
  } = tour || {};

  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const { totalRating, avgRating } = CalculateAvg(reviewsArray);
  const options = { day: "numeric", month: "long", year: "numeric" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      toast.error("Please Sign In first");
      return;
    }

    if (!tourRating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const reviewData = {
        username: user.username,
        reviewText,
        rating: tourRating,
      };
      const response = await fetch(`${BASE_URL}/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Review submitted!");
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={photo} alt={title} className="w-full h-[400px] object-cover" />
            </div>

            {/* Tour Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaMapPin className="text-BaseColor" />
                  <span className="text-sm">{address}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaCity className="text-BaseColor" />
                  <span className="text-sm">{city}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaLocationDot className="text-BaseColor" />
                  <span className="text-sm">{distance} km</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaPeopleGroup className="text-BaseColor" />
                  <span className="text-sm">Max {maxGroupSize}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {avgRating} ({reviewsArray.length} reviews)
                  </span>
                </div>
                <div className="text-2xl font-bold text-BaseColor">Rs. {price}</div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <iframe
                title="Tour Location Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  address || city
                )}&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "1rem" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">
                Reviews ({reviewsArray.length})
              </h3>

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-700 font-medium">Your rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTourRating(star)}
                      className={`text-2xl ${
                        tourRating >= star ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    ref={reviewMsgRef}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsArray.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <img src={avatar} alt={review.username} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h5 className="font-semibold">{review.username}</h5>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("en-US", options)}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center space-x-1">
                        <span className="font-medium">{review.rating}</span>
                        <FaStar className="text-yellow-400" />
                      </div>
                    </div>
                    <p className="text-gray-600 ml-15">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Trip Planner - Contextual to this tour */}
            <TourTripPlanner tour={tour} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <Booking
                title={title}
                price={price}
                avgRating={avgRating}
                reviewsArray={reviewsArray}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;