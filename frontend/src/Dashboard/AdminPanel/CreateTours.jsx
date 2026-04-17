import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../utils/config';
import { AuthContext } from '../../context/AuthContext';
import { FiMap, FiMapPin, FiDollarSign, FiUsers, FiImage, FiNavigation } from 'react-icons/fi';

const CreateTours = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    city: '',
    desc: '',
    address: '',
    price: 0,
    maxGroupSize: 1,
    photo: '',
    distance: 0,
    featured: false
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/tour`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const { message } = await response.json();

      if (response.ok) {
        toast.success(message);
        navigate('/all-tours');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Server not responding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card md:p-10 p-6 shadow-elevated">
          <div className="text-center mb-10">
            <span className="section-overline">Admin Space</span>
            <h2 className="text-display-md text-text-primary mt-2 flex items-center justify-center gap-3">
              Create New Tour
            </h2>
            <p className="text-body-sm text-text-secondary mt-2">Fill in the details to add a new tour package to the platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <div className="relative">
                  <FiMap className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInput}
                    required
                    className="form-input !pl-11"
                    placeholder="E.g., Grand Canyon Adventure"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="form-label">City <span className="text-danger">*</span></label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInput}
                    required
                    className="form-input !pl-11"
                    placeholder="E.g., Las Vegas"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="form-label">Price Per Person (₹) <span className="text-danger">*</span></label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInput}
                    required
                    min="0"
                    className="form-input !pl-11"
                  />
                </div>
              </div>

              {/* Max Group Size */}
              <div>
                <label className="form-label">Max People <span className="text-danger">*</span></label>
                <div className="relative">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="number"
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleInput}
                    required
                    min="1"
                    className="form-input !pl-11"
                  />
                </div>
              </div>

              {/* Distance */}
              <div>
                <label className="form-label">Distance (km)</label>
                <div className="relative">
                  <FiNavigation className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInput}
                    className="form-input !pl-11"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="form-label">Full Address <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInput}
                  required
                  className="form-input"
                  placeholder="Street, Area, City, Zip"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInput}
                  rows="4"
                  className="form-textarea"
                  placeholder="Describe the tour experience, highlights, and itinerary..."
                  required
                />
              </div>

            </div>

            {/* Featured */}
            <div className="flex items-center gap-4 bg-forest-50 p-4 rounded-xl border border-border-light shadow-sm w-fit mt-2">
              <label className="text-body-sm font-bold text-text-primary">Feature on Homepage?</label>
              <select
                name="featured"
                value={formData.featured}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured: e.target.value === "true",
                  })}
                className="form-select bg-white !py-1.5 !text-sm"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-border-light border-dashed">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-cta-lg w-full md:w-auto min-w-[250px] shadow-elevated"
              >
                {isLoading ? <div className="spinner-cta mx-auto" /> : 'Create Tour'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTours;