import React, { useState, useContext, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";

const Booking = ({ price, title, reviewsArray, avgRating }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [mediators, setMediators] = useState([]);
  const [loadingMediators, setLoadingMediators] = useState(false);
  const [data, setData] = useState({
    userId: user?._id || "",
    tourName: title,
    fullName: "",
    totalPrice: price,
    phone: "",
    maxGroupSize: 1,
    bookAt: currentDate,
    date: "",
    mediatorId: "",
    costPerHour: 0,
    hours: 4,
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      tourName: title,
      totalPrice: prev.maxGroupSize * price,
    }));
  }, [title, price]);

  useEffect(() => {
    fetchMediators();
  }, []);

  const fetchMediators = async () => {
    setLoadingMediators(true);
    try {
      const res = await fetch(`${BASE_URL}/mediator-profile/all-mediators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.success) {
        setMediators(result.data.filter(m => m.isAvailable));
      }
    } catch (error) {
      console.error('Error fetching mediators:', error);
    } finally {
      setLoadingMediators(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setData((prev) => ({ ...prev, [e.target.id]: value }));
  };

  const handleMediatorChange = (e) => {
    const mediatorId = e.target.value;
    const selectedMediator = mediators.find(m => m._id === mediatorId);
    setData((prev) => ({
      ...prev,
      mediatorId: mediatorId,
      costPerHour: selectedMediator ? selectedMediator.costPerHour : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to book");
      return;
    }

    // Calculate final total including mediator cost
    const mediatorCost = data.mediatorId ? data.hours * data.costPerHour : 0;
    const finalTotal = data.maxGroupSize * price + mediatorCost;

    const bookingData = {
      ...data,
      totalPrice: finalTotal,
    };

    try {
      const response = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Booking confirmed!");
        navigate("/booked");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-3xl font-bold text-BaseColor">Rs. {price}</span>
          <span className="text-gray-500"> / person</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaStar className="text-yellow-400" />
          <span className="font-medium">{avgRating}</span>
          <span className="text-gray-500">({reviewsArray.length})</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Booking Information</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          id="fullName"
          placeholder="Full Name"
          value={data.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
        />
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          value={data.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
        />
        <input
          type="number"
          id="maxGroupSize"
          placeholder="Number of People"
          value={data.maxGroupSize}
          onChange={handleChange}
          min="1"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
        />
        <input
          type="date"
          id="date"
          value={data.date}
          onChange={handleChange}
          min={currentDate}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
        />

        {/* Mediator Selection */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
          <label htmlFor="mediatorId" className="block text-sm font-semibold text-gray-700 mb-2">
            🗣️ Add a Language Mediator (Optional)
          </label>
          <select
            id="mediatorId"
            value={data.mediatorId}
            onChange={handleMediatorChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          >
            <option value="">Select a mediator...</option>
            {mediators.map((mediator) => (
              <option key={mediator._id} value={mediator._id}>
                {mediator.userId} - ${mediator.costPerHour}/hr
              </option>
            ))}
          </select>
          {data.mediatorId && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-purple-700">
                Mediator rate: <span className="font-bold">Rs. {data.costPerHour}/hour</span>
              </p>
              <input
                type="number"
                id="hours"
                placeholder="Hours of service"
                value={data.hours}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm"
              />
              <p className="text-sm text-purple-700">
                Mediator cost: <span className="font-bold">Rs. {data.hours * data.costPerHour}</span>
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Base Price</span>
            <span className="font-medium">Rs. {price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total People</span>
            <span className="font-medium">{data.maxGroupSize}</span>
          </div>
          {data.mediatorId && (
            <>
              <div className="flex justify-between mb-2 text-purple-700">
                <span>Mediator ({data.hours}h @ Rs. {data.costPerHour}/hr)</span>
                <span className="font-medium">Rs. {data.hours * data.costPerHour}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="text-BaseColor">
              Rs. {data.maxGroupSize * price + (data.mediatorId ? data.hours * data.costPerHour : 0)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Booking;