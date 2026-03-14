import React from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiX, FiCalendar, FiUsers, FiDollarSign } from "react-icons/fi";

const BookingCard = ({ booking }) => {
  const { tourName, totalPrice, maxGroupSize, date, _id } = booking;

  const confirmDelete = async () => {
    const result = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (result) {
      deleteBooking();
    }
  };

  const deleteBooking = async () => {
    try {
      const response = await fetch(`${BASE_URL}/booking/${_id}`, {
        method: "DELETE",
      });
      const { message } = await response.json();

      if (response.ok) {
        toast.success("Booking cancelled successfully");
        // Reload to refresh list (alternatively use state update)
        window.location.reload();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Desktop Table Row */}
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {tourName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {formattedDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {maxGroupSize}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          Rs. {totalPrice}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button
            onClick={confirmDelete}
            className="inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
          >
            <FiX className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </td>
      </tr>

      {/* Mobile Card */}
      <div className="md:hidden bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{tourName}</h3>
          <button
            onClick={confirmDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Cancel booking"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FiCalendar className="w-4 h-4 mr-2 text-BaseColor" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiUsers className="w-4 h-4 mr-2 text-BaseColor" />
            <span>{maxGroupSize} guests</span>
          </div>
          <div className="flex items-center text-sm font-medium text-BaseColor">
            <FiDollarSign className="w-4 h-4 mr-2" />
            <span>Rs. {totalPrice}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;