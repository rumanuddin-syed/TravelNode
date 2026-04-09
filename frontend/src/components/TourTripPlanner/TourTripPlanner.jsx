// src/components/TourTripPlanner/TourTripPlanner.jsx
import React, { useState, useEffect } from "react";
import {
  FaRupeeSign,
  FaHiking,
  FaUserFriends,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCloudSun,
  FaPlane,
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

const COLORS = ["#B71C1C", "#D32F2F", "#FF5722", "#FF8A65", "#FFB74D"];

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

  // Calculate number of days from dates
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const numberOfDays = calculateDays(formData.startDate, formData.endDate);
  const calculatedBudget = (tour?.price || 0) * Number(formData.people) * numberOfDays;

  // Sync destination when tour data loads asynchronously
  useEffect(() => {
    if (tour) {
      setFormData((prev) => ({
        ...prev,
        destination: tour.city || tour.title || prev.destination,
      }));
    }
  }, [tour]);

  // Auto-calculate budget whenever people or dates change
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header Banner — always visible */}
      <div className="bg-gradient-to-r from-BaseColor to-BHoverColor px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <BsStars className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Plan Your Trip to {tour.title}
            </h3>
            <p className="text-sm text-white/80">
              Generate a personalized AI-powered itinerary
            </p>
          </div>
        </div>
      </div>

      {/* Content — always visible */}
      <div className="p-6 md:p-8">
        {/* Form */}
        {!result && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-BaseColor" /> Trip Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Destination - Read-only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-BaseColor" />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-BaseColor/5 text-gray-700 font-medium cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-filled from the selected tour
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Style
                    </label>
                    <select
                      name="travelStyle"
                      value={formData.travelStyle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                    >
                      <option value="solo">Solo</option>
                      <option value="couple">Couple</option>
                      <option value="family">Family</option>
                      <option value="friends">Friends</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      People
                    </label>
                    <div className="relative">
                      <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="people"
                        value={formData.people}
                        onChange={handleChange}
                        min="1"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto-Calculated Budget Display */}
                <div className="bg-gradient-to-r from-BaseColor/5 to-BHoverColor/5 rounded-xl p-4 border border-BaseColor/10">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Total Budget
                  </label>
                  {numberOfDays > 0 ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FaRupeeSign className="text-BaseColor w-4 h-4" />
                        <span className="text-2xl font-bold text-BaseColor">
                          {formatCurrency(calculatedBudget)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        ₹{tour?.price} per person × {formData.people} person{Number(formData.people) > 1 ? "s" : ""} × {numberOfDays} day{numberOfDays > 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Select travel dates to see the estimated budget
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Generating Itinerary...
                    </>
                  ) : (
                    <>
                      <BsStars /> Generate AI Trip Plan
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Panel */}
            <div className="bg-gradient-to-br from-BaseColor/5 to-BHoverColor/5 rounded-2xl p-6 md:p-8 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BsStars className="text-BaseColor" /> What You'll Get
              </h2>
              <ul className="space-y-4">
                {[
                  {
                    text: `Personalized day-by-day itinerary for ${tour.title}`,
                    highlight: true,
                  },
                  { text: "Weather forecasts for your travel dates" },
                  {
                    text: "Detailed budget breakdown to help you plan finances",
                  },
                  { text: "Accommodation and activity recommendations" },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-BaseColor/20 flex items-center justify-center text-BaseColor text-sm">
                      ✓
                    </div>
                    <p className="text-gray-600">
                      {item.highlight ? (
                        <>
                          Personalized day-by-day itinerary for{" "}
                          <span className="font-semibold text-gray-800">
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

              {/* Tour Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Tour Info
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-BaseColor w-4 h-4" />
                    <span>{tour.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaRupeeSign className="text-BaseColor w-4 h-4" />
                    <span>Starting from Rs. {tour.price} / person</span>
                  </div>
                  {tour.maxGroupSize && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUserFriends className="text-BaseColor w-4 h-4" />
                      <span>Max group size: {tour.maxGroupSize}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && weather && (
          <div className="space-y-8 animate-fadeIn">
            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setResult(null);
                  setWeather(null);
                }}
                className="text-sm text-BaseColor hover:text-BHoverColor font-medium underline transition-colors"
              >
                ← Generate New Plan
              </button>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-BaseColor/5 to-BHoverColor/5 rounded-2xl p-6 text-center border border-BaseColor/10">
              <h3 className="text-2xl font-bold text-gray-800">
                ✨ Your Personalized Trip to {tour.title} ✨
              </h3>
              <p className="text-gray-600 mt-2">{result.summary}</p>
              <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                <span>🗓️ {result.duration} days</span>
                <span>
                  👥 {formData.people}{" "}
                  {formData.people === 1 ? "person" : "people"}
                </span>
                <span>💰 {formatCurrency(result.grandTotal)} total</span>
              </div>
            </div>

            {/* Destination Gallery */}
            {result.images && result.images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-BaseColor" /> Destination
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {result.images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition"
                    >
                      <img
                        src={url}
                        alt={`${tour.title} view`}
                        className="w-full h-32 object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Allocation */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaRupeeSign className="text-BaseColor" /> Budget Allocation
              </h3>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  <p className="text-gray-700 mb-2">
                    Your budget is optimized to maximize experience:
                  </p>
                  <ul className="space-y-2">
                    {pieData.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[idx % COLORS.length],
                            }}
                          ></span>
                          {item.name}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(item.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Basecamp */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-BaseColor to-BHoverColor px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaHotel /> Recommended Basecamp
                </h3>
              </div>
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">
                    {result.basecamp.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </span>
                    <span className="text-gray-600">
                      {result.basecamp.rating} / 10
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 max-w-md">
                    {result.basecamp.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price per night</p>
                  <p className="text-3xl font-bold text-BaseColor">
                    {formatCurrency(result.basecamp.price)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    for {formData.people} person(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-BaseColor to-BHoverColor px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaHiking /> Your Daily Itinerary
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {result.days.map((day, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-BaseColor/20 text-BaseColor flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        {day.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaThermometerHalf />
                        <span>{day.temperature}°C</span>
                        <span className="text-gray-400">|</span>
                        <FaCloudSun />
                        <span>{day.condition}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-BaseColor">
                          🌅 Morning
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {day.morning.description}
                        </p>
                        {day.morning.cost > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Cost: {formatCurrency(day.morning.cost)}
                          </p>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-BaseColor">
                          ☀️ Afternoon
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {day.afternoon.description}
                        </p>
                        {day.afternoon.cost > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Cost: {formatCurrency(day.afternoon.cost)}
                          </p>
                        )}
                      </div>
                      {day.evening && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-BaseColor">
                            🌙 Evening
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {day.evening.description}
                          </p>
                          {day.evening.cost > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Cost: {formatCurrency(day.evening.cost)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mx-auto">
                <FaDownload /> Download Plan (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourTripPlanner;
