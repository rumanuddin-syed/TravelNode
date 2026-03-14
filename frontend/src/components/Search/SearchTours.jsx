import React, { useRef } from "react";
import BASE_URL from "../../utils/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchTours = () => {
  const cityRef = useRef(0);
  const navigate = useNavigate();

  const SubmitHandler = async () => {
    const searchTerm = cityRef.current.value;

    if (searchTerm === "") {
      toast.error("Please enter a destination");
    } else {
      const response = await fetch(
        `${BASE_URL}/tour/search?search=${searchTerm}`
      );
      if (!response.ok) {
        toast.error("No Record Found!");
        navigate(`/tours/search?search=${searchTerm}`, { state: [] });
      } else {
        const result = await response.json();
        navigate(`/tours/search?search=${searchTerm}`, { state: result.data });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SubmitHandler();
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-BaseColor/10 to-BHoverColor/10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Find Your <span className="text-BaseColor">Perfect Tour</span>
        </h2>
        <p className="text-gray-600 mb-8">
          Search by destination and discover amazing experiences
        </p>
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-full blur opacity-20"></div>
          <div className="relative flex items-center bg-white rounded-full shadow-lg p-1">
            <input
              type="search"
              ref={cityRef}
              onKeyPress={handleKeyPress}
              className="flex-1 py-4 pl-6 pr-4 bg-transparent rounded-full focus:outline-none placeholder:text-gray-400"
              placeholder="e.g., Paris, Bali, Tokyo"
            />
            <button
              onClick={SubmitHandler}
              className="bg-gradient-to-r from-BaseColor to-BHoverColor text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
            >
              <FiSearch className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchTours;