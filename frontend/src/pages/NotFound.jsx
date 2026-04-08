import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Animated decorative elements */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-BaseColor/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
          <div className="relative">
            <FaExclamationTriangle className="w-24 h-24 text-BaseColor mx-auto mb-4 animate-bounce" />
            <h1 className="text-9xl font-black text-gray-800 relative">
              4<span className="text-BaseColor">0</span>4
            </h1>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been moved, deleted, or never existed.
        </p>

        <Link
          to="/home"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Go to Homepage</span>
          <BsStars className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </Link>

        {/* Helpful suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">You might want to check:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/tours" className="text-sm text-BaseColor hover:underline">Tours</Link>
            <Link to="/about" className="text-sm text-BaseColor hover:underline">Gallery</Link>
            <Link to="/contact" className="text-sm text-BaseColor hover:underline">Contact</Link>
            <Link to="/trip-planner" className="text-sm text-BaseColor hover:underline">Plan a Trip</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;