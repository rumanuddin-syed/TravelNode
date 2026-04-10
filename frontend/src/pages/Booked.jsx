import React, { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const Booked = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="card text-center p-10 md:p-14 shadow-elevated relative overflow-hidden animate-fade-up">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cta/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-success/10 rounded-full mb-8 shadow-sm">
              <FiCheckCircle className="w-12 h-12 text-success animate-pulse" />
            </div>
            
            <h2 className="text-display-md text-text-primary mb-3">
              Congratulations!
            </h2>
            <p className="text-body-lg text-text-secondary mb-10 max-w-sm mx-auto">
              Your tour has been booked successfully! Get ready for your next adventure.
            </p>
            
            <div className="pt-8 border-t border-border-light border-dashed">
              <Link
                to="/my-account"
                className="btn-cta-lg w-full md:w-auto inline-flex justify-center shadow-elevated min-w-[250px]"
              >
                Check My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booked;