import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { FiUsers, FiArrowRight } from "react-icons/fi";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import CalculateAvg from "../utils/CalculateAvg";

const TourCard = ({ tour }) => {
  const { photo, title, city, distance, price, desc, _id, reviews, featured, maxGroupSize } = tour;
  const { totalRating, avgRating } = CalculateAvg(reviews);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group card-hover overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-forest-100 animate-pulse" />
        )}
        <img
          src={photo}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Top Row Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Featured Badge */}
          {featured ? (
            <span className="badge bg-cta text-white shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft" />
              Featured
            </span>
          ) : (
            <span />
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isLiked ? (
              <BsHeartFill className="w-4 h-4 text-danger" />
            ) : (
              <BsHeart className="w-4 h-4 text-forest-600" />
            )}
          </button>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Location & Rating Row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <FaMapMarkerAlt className="w-3 h-3 text-accent" />
            <span className="text-caption font-medium">{city}</span>
          </div>
          <div className="flex items-center gap-1 bg-forest-50 px-2 py-0.5 rounded-lg">
            <FaStar className="w-3 h-3 text-warning" />
            <span className="text-caption font-bold text-text-primary">
              {avgRating}
            </span>
            <span className="text-caption text-text-muted">
              ({reviews?.length || 0})
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/tours/${_id}`}>
          <h3 className="text-body-md font-bold text-text-primary mb-1.5 line-clamp-1 hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-body-sm text-text-secondary mb-4 line-clamp-2 flex-1">
          {desc}
        </p>

        {/* Meta Row */}
        <div className="flex items-center gap-4 mb-4 text-caption text-text-muted">
          <span className="flex items-center gap-1">
            <FiUsers className="w-3.5 h-3.5 text-accent" />
            Up to {maxGroupSize}
          </span>
          <span>{distance} km</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border-light">
          <div>
            <span className="text-caption text-text-muted">From</span>
            <p className="text-xl font-bold text-primary">
              ₹{price}
              <span className="text-caption font-normal text-text-muted">
                /person
              </span>
            </p>
          </div>
          <Link
            to={`/tours/${_id}`}
            className="btn-cta !px-5 !py-2.5 text-body-sm group/btn"
          >
            Book Now
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;