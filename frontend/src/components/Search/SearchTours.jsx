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
      const response = await fetch(`${BASE_URL}/tour/search?search=${searchTerm}`);
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
    if (e.key === "Enter") SubmitHandler();
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-forest-50">
      <div className="max-w-3xl mx-auto text-center">
        <span className="section-overline">Search</span>
        <h2 className="section-title mt-2 mb-3">
          Find Your <span className="text-gradient-forest">Perfect Tour</span>
        </h2>
        <p className="text-body-md text-text-secondary mb-8">
          Search by destination and discover amazing experiences
        </p>
        <div className="relative max-w-xl mx-auto">
          <div className="flex items-center bg-white rounded-2xl shadow-card border border-border-light p-1.5">
            <input
              type="search"
              ref={cityRef}
              onKeyPress={handleKeyPress}
              className="flex-1 py-3.5 pl-5 pr-4 bg-transparent rounded-xl focus:outline-none placeholder:text-text-muted text-text-primary"
              placeholder="e.g., Paris, Bali, Tokyo"
            />
            <button onClick={SubmitHandler} className="btn-cta !rounded-xl">
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