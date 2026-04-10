import React, { useState, useEffect } from "react";
import TourCard from "../shared/TourCard";
import useFetch from "../hooks/useFetch";
import BASE_URL from "../utils/config";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

const MyTrips = () => {
  const [interestTags, setInterestTags] = useState([]);
  const [budget, setBudget] = useState("");
  const [filteredTours, setFilteredTours] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState([]);
  
  const { apiData: allTours, loading } = useFetch(`${BASE_URL}/tour`);

  const interestsList = [
    "Adventure", "Beach", "Culture", "City", "Mountains",
    "Relaxation", "Wildlife", "History", "Food", "Luxury",
    "Budget", "Family-friendly"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedHistory = JSON.parse(localStorage.getItem("tripSearchHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  const handleTagToggle = (tag) => {
    setInterestTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setInterestTags([]);
    setBudget("");
    setFilteredTours([]);
    setHasSearched(false);
  };

  const handleSearch = () => {
    if (!allTours) return;

    let filtered = allTours;

    if (interestTags.length > 0) {
      filtered = filtered.filter((tour) =>
        interestTags.some(
          (tag) =>
            tour.title.toLowerCase().includes(tag.toLowerCase()) ||
            tour.desc.toLowerCase().includes(tag.toLowerCase()) ||
            tour.city.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }

    if (budget) {
      filtered = filtered.filter((tour) => tour.price <= parseInt(budget));
    }

    const newSearch = {
      tags: interestTags,
      budget,
      date: new Date().toISOString(),
      resultsCount: filtered.length
    };
    
    if (interestTags.length > 0 || budget) {
      const newHistory = [newSearch, ...history.slice(0, 4)];
      setHistory(newHistory);
      localStorage.setItem("tripSearchHistory", JSON.stringify(newHistory));
    }

    setFilteredTours(filtered);
    setHasSearched(true);
  };

  const loadHistoryItem = (item) => {
    setInterestTags(item.tags);
    setBudget(item.budget);
    setTimeout(handleSearch, 100);
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <section className="bg-forest-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <h1 className="text-display-md text-white mb-4">Plan Your Trip</h1>
          <p className="text-body-lg text-forest-200 max-w-2xl mx-auto">
            Tell us what you love and your budget, and we'll find the perfect match.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-body-lg font-bold flex items-center gap-2">
                  <FiFilter className="text-accent" /> Filters
                </h3>
                {(interestTags.length > 0 || budget) && (
                  <button onClick={clearFilters} className="text-caption text-danger hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Interests */}
              <div className="mb-8">
                <label className="form-label text-text-secondary mb-3">Your Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleTagToggle(interest)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        interestTags.includes(interest)
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-border-light text-text-secondary hover:border-accent hover:text-primary"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-8">
                <label className="form-label text-text-secondary mb-3">Max Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 500"
                  className="form-input"
                  min="0"
                />
              </div>

              <button onClick={handleSearch} className="w-full btn-cta">
                <FiSearch className="w-4 h-4" /> Find Trips
              </button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="card p-6">
                <h3 className="text-body-md font-bold mb-4">Recent Searches</h3>
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => loadHistoryItem(item)}
                      className="p-3 bg-forest-50 hover:bg-forest-100 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.length > 0 ? (
                          item.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-white px-2 py-0.5 rounded text-primary font-medium">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded text-text-muted">No tags</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-caption text-text-muted">
                        <span>{item.budget ? `₹${item.budget}` : 'Any budget'}</span>
                        <span>{item.resultsCount} tours</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="spinner" />
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-20 bg-forest-50/50 rounded-3xl border border-dashed border-border-default">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FiFilter className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-display-sm text-text-primary mb-2">Let's find your dream trip</h2>
                <p className="text-body-lg text-text-secondary max-w-md mx-auto">
                  Select your interests and set a budget to see personalized recommendations.
                </p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-20 bg-forest-50/50 rounded-3xl border border-dashed border-border-default">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FiX className="w-8 h-8 text-danger" />
                </div>
                <h2 className="text-display-sm text-text-primary mb-2">No matches found</h2>
                <p className="text-body-lg text-text-secondary max-w-md mx-auto mb-6">
                  We couldn't find any tours matching your exact criteria. Try removing some filters or increasing your budget.
                </p>
                <button onClick={clearFilters} className="btn-secondary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-body-lg font-bold mb-6 text-text-primary">
                  Found {filteredTours.length} exactly for you
                </h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTours.map(tour => (
                    <TourCard key={tour._id} tour={tour} />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default MyTrips;
