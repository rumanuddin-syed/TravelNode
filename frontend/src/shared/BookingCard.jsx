import React from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiX, FiCalendar, FiUsers } from "react-icons/fi";

const BookingCard = ({ booking }) => {
  const { tourName, totalPrice, maxGroupSize, date, _id } = booking;

  const confirmDelete = async () => {
    const result = window.confirm(
      "Are you sure you want to cancel this booking?"
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
        window.location.reload();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Desktop Table Row */}
      <tr className="table-row">
        <td className="font-medium">{tourName}</td>
        <td>{formattedDate}</td>
        <td>{maxGroupSize}</td>
        <td className="font-semibold text-primary">₹{totalPrice}</td>
        <td className="text-right">
          <button
            onClick={confirmDelete}
            className="inline-flex items-center gap-1.5 text-body-sm text-danger bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-lg transition-colors font-medium"
          >
            <FiX className="w-4 h-4" />
            Cancel
          </button>
        </td>
      </tr>

      {/* Mobile Card */}
      <div className="md:hidden card p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-body-md font-semibold text-text-primary">
            {tourName}
          </h3>
          <button
            onClick={confirmDelete}
            className="p-1.5 text-danger hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Cancel booking"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-body-sm text-text-secondary">
            <FiCalendar className="w-4 h-4 mr-2 text-accent" />
            {formattedDate}
          </div>
          <div className="flex items-center text-body-sm text-text-secondary">
            <FiUsers className="w-4 h-4 mr-2 text-accent" />
            {maxGroupSize} guests
          </div>
          <p className="text-body-md font-bold text-primary">₹{totalPrice}</p>
        </div>
      </div>
    </>
  );
};

export default BookingCard;