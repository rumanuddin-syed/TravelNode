import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaCompass, FaHistory, FaTimes, FaRupeeSign } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import TourCard from "../shared/TourCard";
import BASE_URL from "../utils/config";

const PAST_SEARCHES_KEY = "travelnode_past_search_tours";

// Interest tags for quick multi-select
const INTEREST_TAGS = [
  "Adventure",
  "Beach",
  "Mountain",
  "Historical",
  "Desert",
  "Wildlife",
  "Temple",
  "Waterfall",
  "Safari",
  "Cultural",
  "Trekking",
  "Cruise",
];

const MyTrips = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tours, setTours] = useState([]);
  const [pastSearchedTours, setPastSearchedTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load past searched tours from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PAST_SEARCHES_KEY);
      if (stored) {
        setPastSearchedTours(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load past searches:", err);
    }
  }, []);

  // Save search results to localStorage
  const savePastSearches = (tourResults) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(PAST_SEARCHES_KEY) || "[]"
      );
      const merged = [...tourResults, ...existing];
      const unique = merged.filter(
        (tour, idx, self) => self.findIndex((t) => t._id === tour._id) === idx
      );
      const trimmed = unique.slice(0, 20);
      localStorage.setItem(PAST_SEARCHES_KEY, JSON.stringify(trimmed));
      setPastSearchedTours(trimmed);
    } catch (err) {
      console.error("Failed to save past searches:", err);
    }
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Search with selected tags + budget range
  const handleSearch = async () => {
    if (selectedTags.length === 0 && !minPrice && !maxPrice) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();

      // Combine selected tags with "|" for regex OR matching
      if (selectedTags.length > 0) {
        params.append("search", selectedTags.join("|"));
      }
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await fetch(`${BASE_URL}/tour/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const results = data.data || [];
        setTours(results);
        if (results.length > 0) {
          savePastSearches(results);
        }
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when tags or budget changes
  useEffect(() => {
    if (selectedTags.length > 0 || minPrice || maxPrice) {
      const debounce = setTimeout(() => {
        handleSearch();
      }, 400);
      return () => clearTimeout(debounce);
    }
    // eslint-disable-next-line
  }, [selectedTags, minPrice, maxPrice]);

  const handleClearSearch = () => {
    setSelectedTags([]);
    setMinPrice("");
    setMaxPrice("");
    setHasSearched(false);
    setTours([]);
  };

  const clearPastSearches = () => {
    localStorage.removeItem(PAST_SEARCHES_KEY);
    setPastSearchedTours([]);
  };

  const displayTours = hasSearched ? tours : pastSearchedTours;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-BaseColor/10 via-white to-BHoverColor/10 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-BaseColor/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-BHoverColor/5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-BaseColor/10 px-4 py-2 rounded-full mb-6">
            <BsStars className="w-5 h-5 text-BaseColor" />
            <span className="text-sm font-medium text-BaseColor">
              AI-Powered Tour Planning
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Find Your{" "}
            <span className="bg-gradient-to-r from-BaseColor to-BHoverColor bg-clip-text text-transparent">
              Perfect Tour
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Select your interests and set a budget to discover the best tours
            for you.
          </p>

          {/* Interest Tags — Multi-Select */}
          <div className="max-w-3xl mx-auto mb-6">
            <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
              Select your interests
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                      isSelected
                        ? "bg-gradient-to-r from-BaseColor to-BHoverColor text-white shadow-md scale-105"
                        : "bg-white border border-gray-200 text-gray-600 hover:text-BaseColor hover:border-BaseColor hover:bg-BaseColor/5 hover:shadow-md"
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {selectedTags.length} interest{selectedTags.length > 1 ? "s" : ""}{" "}
                selected
              </p>
            )}
          </div>

          {/* Budget Range + Search Button */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-2xl blur opacity-15"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-4 md:p-5">
                <p className="text-sm font-medium text-gray-500 mb-3 text-left uppercase tracking-wider">
                  Budget Range (Optional)
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 w-full">
                    <div className="relative flex-1">
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min budget"
                        className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition text-sm text-gray-700 placeholder:text-gray-400"
                      />
                    </div>
                    <span className="text-gray-400 font-medium">to</span>
                    <div className="relative flex-1">
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max budget"
                        className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition text-sm text-gray-700 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={
                      loading ||
                      (selectedTags.length === 0 && !minPrice && !maxPrice)
                    }
                    className="w-full sm:w-auto bg-gradient-to-r from-BaseColor to-BHoverColor text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <FiSearch className="w-5 h-5" />
                    <span>{loading ? "Searching..." : "Search Tours"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              {hasSearched ? (
                <>
                  Search <span className="text-BaseColor">Results</span>
                </>
              ) : pastSearchedTours.length > 0 ? (
                <>
                  <FaHistory className="text-BaseColor w-6 h-6" />
                  Recently <span className="text-BaseColor">Explored</span>
                </>
              ) : (
                <>
                  Discover <span className="text-BaseColor">Tours</span>
                </>
              )}
            </h2>
            <p className="text-gray-500 mt-1">
              {hasSearched
                ? `${tours.length} tour${tours.length !== 1 ? "s" : ""} found${
                    selectedTags.length > 0
                      ? ` for "${selectedTags.join(", ")}"`
                      : ""
                  }${
                    minPrice || maxPrice
                      ? ` • Budget: ₹${minPrice || "0"} – ₹${maxPrice || "∞"}`
                      : ""
                  }`
                : pastSearchedTours.length > 0
                  ? "Tours from your recent searches"
                  : "Select interests above to get started"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasSearched && (
              <button
                onClick={handleClearSearch}
                className="text-sm text-BaseColor hover:text-BHoverColor font-medium underline transition-colors"
              >
                Clear search
              </button>
            )}
            {!hasSearched && pastSearchedTours.length > 0 && (
              <button
                onClick={clearPastSearches}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                <FaTimes className="w-3 h-3" />
                Clear history
              </button>
            )}
          </div>
        </div>

        {/* Tour Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-BaseColor/30 border-t-BaseColor rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">
                Finding matching tours...
              </p>
            </div>
          </div>
        ) : displayTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FaCompass className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Tours Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try selecting different interests or adjusting your budget range.
            </p>
            <button
              onClick={handleClearSearch}
              className="px-6 py-3 bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-BaseColor/10 to-BHoverColor/10 rounded-full mb-6">
              <FiSearch className="w-12 h-12 text-BaseColor/60" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Start Exploring
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Select one or more interest tags above and optionally set a budget
              range to discover tours tailored to you.
            </p>

            {/* How It Works */}
            <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Select Interests",
                  desc: "Pick multiple tags like Adventure, Beach, Mountain to find matching tours.",
                  icon: "🏷️",
                },
                {
                  step: "02",
                  title: "Choose Your Tour",
                  desc: "Browse the results, read details, and pick the tour that excites you most.",
                  icon: "🗺️",
                },
                {
                  step: "03",
                  title: "Generate AI Plan",
                  desc: "Inside tour details, use the AI planner to create a personalized itinerary.",
                  icon: "✨",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="absolute -top-4 left-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyTrips;
