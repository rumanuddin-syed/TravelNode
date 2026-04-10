import React, { useState, useEffect } from "react";
import {
  FaRupeeSign,
  FaHiking,
  FaUserFriends,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCloudSun,
  FaHotel,
  FaStar,
  FaDownload,
  FaSpinner,
  FaThermometerHalf,
} from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import BASE_URL from "../../utils/config";

const COLORS = ["#1B4332", "#40916C", "#74C69D", "#B7E4C7", "#4CC9F0"];

const TourTripPlanner = ({ tour }) => {
  const [formData, setFormData] = useState({
    destination: tour?.city || tour?.title || "",
    startDate: "",
    endDate: "",
    people: 1,
    travelStyle: "solo",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const numberOfDays = calculateDays(formData.startDate, formData.endDate);
  const calculatedBudget = (tour?.price || 0) * Number(formData.people) * numberOfDays;

  useEffect(() => {
    if (tour) {
      setFormData((prev) => ({
        ...prev,
        destination: tour.city || tour.title || prev.destination,
      }));
    }
  }, [tour]);

  useEffect(() => {
    if (numberOfDays > 0 && tour?.price) {
      setFormData((prev) => ({
        ...prev,
        budget: String(calculatedBudget),
      }));
    }
  }, [formData.people, formData.startDate, formData.endDate, numberOfDays, calculatedBudget, tour?.price]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/planner/plan-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        const dailyWeather = data.days.map((day) => ({
          day: day.dayNumber,
          temp: day.temperature,
          condition: day.condition,
        }));
        setWeather({
          condition: data.days[0]?.condition || "Partly cloudy",
          temp: data.days[0]?.temperature || 28,
          feelsLike: (data.days[0]?.temperature || 28) + 2,
          humidity: 65,
          wind: 12,
          icon: "☁️",
          daily: dailyWeather,
        });
      } else {
        throw new Error(data.error || "Failed to generate plan");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const pieData = result
    ? Object.entries(result.budgetBreakdown).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  if (!tour) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-none shadow-elevated">
      {/* Header Banner */}
      <div className="bg-gradient-forest px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <BsStars className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-body-lg font-bold text-white">
              Plan Your Trip to {tour.title}
            </h3>
            <p className="text-sm text-forest-200">
              Generate a personalized AI-powered itinerary
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {!result && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-display-sm text-text-primary mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-accent" /> Trip Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="form-label">Destination</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      readOnly
                      className="form-input !pl-11 !bg-forest-50/50 text-text-secondary cursor-not-allowed border-dashed!"
                    />
                  </div>
                  <p className="text-caption text-text-muted mt-1.5 ml-1">
                    Auto-filled from the selected tour
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="form-input !pl-11 !pr-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="form-input !pl-11 !pr-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Travel Style</label>
                    <select
                      name="travelStyle"
                      value={formData.travelStyle}
                      onChange={handleChange}
                      className="form-select text-sm"
                    >
                      <option value="solo">Solo</option>
                      <option value="couple">Couple</option>
                      <option value="family">Family</option>
                      <option value="friends">Friends</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">People</label>
                    <div className="relative">
                      <FaUserFriends className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="number"
                        name="people"
                        value={formData.people}
                        onChange={handleChange}
                        min="1"
                        required
                        className="form-input !pl-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-forest-50 rounded-xl p-5 border border-border-light">
                  <label className="block text-body-sm font-semibold text-text-secondary mb-2">
                    Estimated Total Budget
                  </label>
                  {numberOfDays > 0 ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-display-sm font-bold text-primary">
                          {formatCurrency(calculatedBudget)}
                        </span>
                      </div>
                      <p className="text-caption text-text-secondary">
                        ₹{tour?.price} per person × {formData.people} traveler{Number(formData.people) > 1 ? "s" : ""} × {numberOfDays} day{numberOfDays > 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-body-sm text-text-muted italic">
                      Select travel dates to see the estimated budget
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-cta-lg"
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin w-5 h-5" /> Generating Itinerary...</>
                  ) : (
                    <><BsStars className="w-5 h-5" /> Generate AI Trip Plan</>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 h-fit border border-primary/10">
              <h2 className="text-display-sm text-text-primary mb-5 flex items-center gap-2">
                <BsStars className="text-accent" /> What You'll Get
              </h2>
              <ul className="space-y-4">
                {[
                  { text: `Personalized day-by-day itinerary`, highlight: true },
                  { text: "Weather forecasts for your travel dates" },
                  { text: "Detailed budget breakdown to help you plan finances" },
                  { text: "Accommodation and activity recommendations" },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cta/20 flex items-center justify-center text-cta text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <p className="text-body-sm text-text-secondary leading-relaxed">
                      {item.highlight ? (
                        <>
                          Personalized day-by-day itinerary for{" "}
                          <span className="font-bold text-text-primary">
                            {tour.title}
                          </span>
                        </>
                      ) : (
                        item.text
                      )}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border-default">
                <h4 className="text-caption font-bold text-text-muted uppercase tracking-wider mb-4">
                  Tour Info
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <FaMapMarkerAlt className="text-accent" />
                    </div>
                    <span className="font-medium text-text-primary">{tour.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <FaRupeeSign className="text-accent" />
                    </div>
                    <span className="font-medium text-text-primary">Starting from ₹{tour.price} / per</span>
                  </div>
                  {tour.maxGroupSize && (
                    <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <FaUserFriends className="text-accent" />
                      </div>
                      <span className="font-medium text-text-primary">Max group size: {tour.maxGroupSize}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {result && weather && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setResult(null);
                  setWeather(null);
                }}
                className="text-body-sm text-accent hover:text-primary font-bold underline transition-colors"
              >
                ← Generate New Plan
              </button>
            </div>

            <div className="bg-gradient-forest rounded-2xl p-8 text-center text-white shadow-elevated relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <h3 className="text-display-md mb-2">
                  ✨ Your Personalized Trip to {tour.title} ✨
                </h3>
                <p className="text-forest-200 text-body-lg max-w-2xl mx-auto">{result.summary}</p>
                <div className="flex justify-center gap-6 mt-6">
                  <span className="badge bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 text-sm">🗓️ {result.duration} days</span>
                  <span className="badge bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 text-sm">👥 {formData.people} {formData.people === 1 ? "person" : "people"}</span>
                  <span className="badge bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 text-sm">💰 {formatCurrency(result.grandTotal)} total</span>
                </div>
              </div>
            </div>

            {/* Destination Gallery */}
            {result.images && result.images.length > 0 && (
              <div className="card p-6 md:p-8">
                <h3 className="text-display-sm text-text-primary mb-6 flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-accent" />
                  </span>
                  Destination Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {result.images.map((url, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-xl bg-forest-50 aspect-square">
                      <img
                        src={url}
                        alt={`${tour.title} view`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Allocation */}
            <div className="card p-6 md:p-8">
              <h3 className="text-display-sm text-text-primary mb-6 flex items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center">
                  <FaRupeeSign className="w-5 h-5 text-accent" />
                </span>
                Budget Allocation
              </h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-body-md text-text-secondary mb-6 leading-relaxed">
                    Your budget is automatically optimized to maximize your experience across different categories:
                  </p>
                  <ul className="space-y-3">
                    {pieData.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center p-3 rounded-xl bg-forest-50 hover:bg-forest-100 transition-colors">
                        <span className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                          <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                          {item.name}
                        </span>
                        <span className="font-bold text-primary text-sm">
                          {formatCurrency(item.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Basecamp */}
            <div className="card overflow-hidden">
              <div className="bg-forest-50 px-6 py-5 border-b border-border-light">
                <h3 className="text-body-lg font-bold text-primary flex items-center gap-2">
                  <FaHotel className="text-accent" /> Recommended Basecamp
                </h3>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h4 className="text-display-sm text-text-primary mb-2">
                    {result.basecamp.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex text-warning">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </span>
                    <span className="text-caption font-bold text-text-secondary bg-white border border-border-default px-2 py-0.5 rounded-md">
                      {result.basecamp.rating} / 10
                    </span>
                  </div>
                  <p className="text-body-sm text-text-secondary leading-relaxed max-w-2xl">
                    {result.basecamp.description}
                  </p>
                </div>
                <div className="text-left md:text-right bg-white p-5 rounded-2xl border border-border-light shadow-sm min-w-[200px]">
                  <p className="text-caption font-bold text-text-muted uppercase tracking-wider mb-1">Price per night</p>
                  <p className="text-3xl font-bold text-primary mb-1">
                    {formatCurrency(result.basecamp.price)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    for {formData.people} traveler(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="card overflow-hidden">
              <div className="bg-forest-50 px-6 py-5 border-b border-border-light">
                <h3 className="text-body-lg font-bold text-primary flex items-center gap-2">
                  <FaHiking className="text-accent" /> Your Daily Itinerary
                </h3>
              </div>
              <div className="divide-y divide-border-light">
                {result.days.map((day, idx) => (
                  <div key={idx} className="p-6 md:p-8 hover:bg-forest-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                      <h4 className="text-body-lg font-bold text-text-primary flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm shadow-sm">
                          Day {idx + 1}
                        </span>
                        {day.title}
                      </h4>
                      <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-border-light shadow-sm">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                          <FaThermometerHalf className="text-accent" /> {day.temperature}°C
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border-default"></div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                          <FaCloudSun className="text-cta" /> {day.condition}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
                        <p className="text-sm font-bold text-cta mb-2 flex items-center gap-2">
                          <span className="text-lg">🌅</span> Morning
                        </p>
                        <p className="text-body-sm text-text-secondary leading-relaxed mb-3">
                          {day.morning.description}
                        </p>
                        {day.morning.cost > 0 && (
                          <p className="text-xs font-bold text-primary bg-forest-50 px-3 py-1.5 rounded-lg inline-block">
                            Est. Cost: {formatCurrency(day.morning.cost)}
                          </p>
                        )}
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
                        <p className="text-sm font-bold text-warning mb-2 flex items-center gap-2">
                          <span className="text-lg">☀️</span> Afternoon
                        </p>
                        <p className="text-body-sm text-text-secondary leading-relaxed mb-3">
                          {day.afternoon.description}
                        </p>
                        {day.afternoon.cost > 0 && (
                          <p className="text-xs font-bold text-primary bg-forest-50 px-3 py-1.5 rounded-lg inline-block">
                            Est. Cost: {formatCurrency(day.afternoon.cost)}
                          </p>
                        )}
                      </div>
                      {day.evening && (
                        <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm">
                          <p className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                            <span className="text-lg">🌙</span> Evening
                          </p>
                          <p className="text-body-sm text-text-secondary leading-relaxed mb-3">
                            {day.evening.description}
                          </p>
                          {day.evening.cost > 0 && (
                            <p className="text-xs font-bold text-primary bg-forest-50 px-3 py-1.5 rounded-lg inline-block">
                              Est. Cost: {formatCurrency(day.evening.cost)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button className="btn-cta-lg mx-auto shadow-elevated">
                <FaDownload /> Download PDF Itinerary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourTripPlanner;
