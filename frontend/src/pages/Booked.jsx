import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Booked = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-600 mb-8">Your tour has been booked successfully!</p>
          <Link
            to="/my-account"
            className="inline-block bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Check My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Booked;