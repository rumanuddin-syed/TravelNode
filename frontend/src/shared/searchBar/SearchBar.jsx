import React, { useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const minPriceRef = useRef(0);
  const maxPriceRef = useRef(0);
  const cityRef = useRef(0);
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const SubmitHandler = async () => {
    const minPrice = minPriceRef.current.value;
    const maxPrice = maxPriceRef.current.value;
    const searchTerm = cityRef.current.value;

    if (minPrice === "" || maxPrice === "" || searchTerm === "") {
      toast.error("Please fill all the fields");
    } else {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${BASE_URL}/tour/search?search=${searchTerm}&minPrice=${minPrice}&maxPrice=${maxPrice}`
        );
        if (!response.ok) {
          toast.error("No Record Found!");
          return;
        }
        const result = await response.json();
        navigate(
          `/tours/search?search=${searchTerm}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
          { state: result.data }
        );
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setIsSearching(false);
      }
    }
  };

  const popularCities = ["Paris", "Bali", "Tokyo", "New York", "Dubai"];

  return (
    <div className="relative -mt-8 z-30 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="card-elevated p-5 md:p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-accent" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={cityRef}
                className="form-input"
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <FiDollarSign className="w-3.5 h-3.5 text-accent" />
                Min Price
              </label>
              <input
                type="number"
                placeholder="₹ Min"
                ref={minPriceRef}
                className="form-input"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <FiDollarSign className="w-3.5 h-3.5 text-accent" />
                Max Price
              </label>
              <input
                type="number"
                placeholder="₹ Max"
                ref={maxPriceRef}
                className="form-input"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={SubmitHandler}
                disabled={isSearching}
                className="w-full btn-cta"
              >
                {isSearching ? (
                  <>
                    <span className="spinner-cta" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap items-center gap-2">
            <span className="text-caption text-text-muted">Popular:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  cityRef.current.value = city;
                }}
                className="tag-default !py-1 !px-3 text-caption"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;