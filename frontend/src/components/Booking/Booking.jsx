import React, { useState, useContext, useEffect } from "react";
import { FaStar, FaUserTie } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiPhone, FiUser, FiCalendar, FiClock } from "react-icons/fi";

const Booking = ({ tour, avgRating }) => {
  const { price, title, maxGroupSize, reviews: reviewsArray } = tour;
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
    hours: undefined,
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
      hours: mediatorId ? 4 : undefined, // default 4 hours if a mediator is selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to book");
      return;
    }

    const mediatorCost = data.mediatorId ? (data.hours || 0) * data.costPerHour : 0;
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

  const baseTotal = data.maxGroupSize * price;
  const mediatorTotal = data.mediatorId ? (data.hours || 0) * data.costPerHour : 0;
  const grandTotal = baseTotal + mediatorTotal;

  return (
    <div className="card p-6 md:p-8 bg-white border-none shadow-elevated">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-border-light">
        <div>
          <span className="text-display-sm text-primary">₹{price}</span>
          <span className="text-body-sm text-text-muted"> / person</span>
        </div>
        <div className="flex items-center gap-1.5 bg-forest-50 px-3 py-1.5 rounded-xl">
          <FaStar className="w-4 h-4 text-warning" />
          <span className="font-bold text-primary">{avgRating}</span>
          <span className="text-caption text-text-secondary">({reviewsArray?.length})</span>
        </div>
      </div>

      <h3 className="text-body-lg font-bold text-text-primary mb-5">Booking Information</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={data.fullName}
              onChange={handleChange}
              required
              className="form-input !pl-11"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              value={data.phone}
              onChange={handleChange}
              required
              className="form-input !pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="date"
              id="date"
              value={data.date}
              onChange={handleChange}
              min={currentDate}
              required
              className="form-input !pl-11 !pr-3 text-sm"
            />
          </div>
          <div className="relative">
            <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="number"
              id="maxGroupSize"
              placeholder="Guests"
              value={data.maxGroupSize}
              onChange={handleChange}
              min="1"
              max={maxGroupSize}
              required
              className="form-input !pl-11"
            />
          </div>
        </div>

        {/* Mediator Selection */}
        <div className="mt-6 mb-2 bg-sky-50 rounded-2xl p-5 border border-sky-100">
          <label htmlFor="mediatorId" className="flex items-center gap-2 text-body-sm font-bold text-sky-900 mb-3">
            <FaUserTie className="text-cta" /> Add a Language Mediator
          </label>
          <div className="relative">
            <select
              id="mediatorId"
              value={data.mediatorId}
              onChange={handleMediatorChange}
              className="form-select w-full !bg-white !border-sky-200 focus:!border-cta !py-2.5"
            >
              <option value="">Select a mediator (Optional)</option>
              {mediators.map((mediator) => (
                <option key={mediator._id} value={mediator._id}>
                  {mediator.userId} (₹{mediator.costPerHour}/hr)
                </option>
              ))}
            </select>
          </div>

          {data.mediatorId && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-sky-100 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between mb-3 text-body-sm">
                <span className="text-text-secondary">Mediator Rate</span>
                <span className="font-bold text-primary">₹{data.costPerHour}/hr</span>
              </div>
              <div className="relative mb-3">
                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="number"
                  id="hours"
                  placeholder="Duration (hours)"
                  value={data.hours}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  className="form-input !pl-11 !py-2"
                />
              </div>
              <div className="flex items-center justify-between text-body-sm pt-2 border-t border-border-light">
                <span className="text-text-secondary">Mediator Total</span>
                <span className="font-bold text-primary text-body-md">₹{mediatorTotal}</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-forest-50 rounded-2xl p-5 mt-6 border border-border-light">
          <div className="space-y-3 mb-4 text-body-sm border-b border-border-default pb-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">₹{price} × {data.maxGroupSize} travelers</span>
              <span className="font-bold text-primary">₹{baseTotal}</span>
            </div>
            {data.mediatorId && (
              <div className="flex justify-between text-cta-hover">
                <span>Mediator ({data.hours || 0}h)</span>
                <span className="font-bold">₹{mediatorTotal}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Service fee</span>
              <span className="font-bold text-success">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md font-bold text-primary">Total Price</span>
            <span className="text-display-sm font-bold text-cta">₹{grandTotal}</span>
          </div>
        </div>

        <button type="submit" className="w-full btn-cta-lg mt-6">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;