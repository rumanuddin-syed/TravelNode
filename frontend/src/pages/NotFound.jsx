import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertTriangle, FiMap, FiPhone, FiImage } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cta/5 rounded-full blur-3xl mix-blend-multiply" />

      <div className="max-w-xl w-full text-center relative z-10">
        {/* Animated decorative elements */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
          <div className="relative">
            <FiAlertTriangle className="w-20 h-20 text-accent mx-auto mb-6 animate-bounce" />
            <h1 className="text-[120px] leading-none font-black text-primary relative drop-shadow-sm">
              4<span className="text-cta">0</span>4
            </h1>
          </div>
        </div>

        <h2 className="text-display-md text-text-primary mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-body-lg text-text-secondary mb-10 max-w-sm mx-auto">
          The page you are looking for might have been moved, deleted, or never existed in our compass.
        </p>

        <Link
          to="/home"
          className="btn-cta-lg inline-flex"
        >
          <FiHome className="w-5 h-5 mr-2" />
          Back to Homepage
        </Link>

        {/* Helpful suggestions */}
        <div className="mt-16 pt-10 border-t border-border-light border-dashed">
          <p className="text-body-sm font-bold text-text-muted mb-6 uppercase tracking-wider">You might want to check:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tours" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border-light hover:border-accent hover:text-primary transition-colors text-body-sm font-bold text-text-secondary shadow-sm">
              <FiMap className="text-accent" /> Tours
            </Link>
            <Link to="/about" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border-light hover:border-accent hover:text-primary transition-colors text-body-sm font-bold text-text-secondary shadow-sm">
              <FiImage className="text-accent" /> Gallery
            </Link>
            <Link to="/contact" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border-light hover:border-accent hover:text-primary transition-colors text-body-sm font-bold text-text-secondary shadow-sm">
              <FiPhone className="text-accent" /> Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;