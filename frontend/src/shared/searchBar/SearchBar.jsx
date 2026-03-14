import React, { useRef, useState } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
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

  return (
    <div className="relative -mt-8 z-30">
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Location Input */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaMapMarkerAlt className="inline mr-2 text-blue-500" />
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Where are you going?"
                ref={cityRef}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Min Price Input */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <IoIosPricetags className="inline mr-2 text-blue-500" />
              Min Price
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="Min Price"
                ref={minPriceRef}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Max Price Input */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <IoIosPricetags className="inline mr-2 text-blue-500" />
              Max Price
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="Max Price"
                ref={maxPriceRef}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={SubmitHandler}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FaSearch className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
          <div className="flex flex-wrap gap-2">
            {['Paris', 'Bali', 'Tokyo', 'New York', 'Dubai'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  cityRef.current.value = city;
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors"
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