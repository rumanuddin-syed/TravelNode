import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";

const UpdateTours = ({ tour, id }) => {
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    desc: "",
    address: "",
    price: 0, 
    maxGroupSize: 1,
    photo: "",
    distance: 0,
    featured: false,
  });

  useEffect(() => {
    if (tour) {
      const {
        title,
        city,
        desc,
        address,
        price,
        maxGroupSize,
        photo,
        distance,
        featured,
      } = tour;

      setFormData({
        title: title || "",
        city: city || "",
        desc: desc || "",
        address: address || "",
        price: price || 0,
        maxGroupSize: maxGroupSize || 1,
        photo: photo || "",
        distance: distance || 0,
        featured: featured || false,
      });
    }
  }, [tour]);

 const handleInput = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/tour/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const { message } = await response.json();

      if (response.ok) {
        toast.success(message);
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Update Tour</h2>
          <p className="text-gray-500">Modify the tour details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInput}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                placeholder="Enter tour title"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInput}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                placeholder="Enter city"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs. )</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInput}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
              />
            </div>

            {/* Max Group Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max People</label>
              <input
                type="number"
                name="maxGroupSize"
                value={formData.maxGroupSize}
                onChange={handleInput}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleInput}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInput}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                placeholder="Full address"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleInput}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                placeholder="Tour description"
              />
            </div>

            {/* Photo URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleInput}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Featured */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Featured</span>
                <select
                  name="featured"
                  value={formData.featured ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured: e.target.value === "true",
                    })}
                  className="ml-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTours;