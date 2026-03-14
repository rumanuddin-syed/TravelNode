import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers } from "react-icons/fa";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import CalculateAvg from "../utils/CalculateAvg";

const TourCard = ({ tour }) => {
  const { photo, title, city, distance, price, desc, _id, reviews, featured, maxGroupSize } = tour;
  const { totalRating, avgRating } = CalculateAvg(reviews);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm opacity-75 animate-pulse"></div>
            <span className="relative px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
              Featured
            </span>
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group/like"
      >
        {isLiked ? (
          <BsHeartFill className="w-5 h-5 text-red-500 animate-pulse" />
        ) : (
          <BsHeart className="w-5 h-5 text-gray-600 group-hover/like:text-red-500 transition-colors" />
        )}
      </button>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={photo}
          alt={title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <FaMapMarkerAlt className="w-3 h-3 text-blue-500" />
            <span>{city}</span>
          </div>
          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
            <FaStar className="w-3 h-3 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
            <span className="text-xs text-gray-400">({reviews.length})</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/tours/${_id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {desc}
        </p>

        {/* Tour Details */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <FaClock className="w-3 h-3 text-blue-500" />
            <span>{distance} km</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <FaUsers className="w-3 h-3 text-blue-500" />
            <span>Up to {maxGroupSize}</span>
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">Starting from</span>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rs. {price}
            </p>
          </div>
          <Link
            to={`/tours/${_id}`}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
          >
            <span className="relative z-10">Book Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;