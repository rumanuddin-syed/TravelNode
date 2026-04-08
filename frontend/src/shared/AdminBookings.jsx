import React from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";

const AdminBookingCard = ({ booking }) => {
  const {
    tourName,
    fullName,
    userId,
    phone,
    totalPrice,
    maxGroupSize,
    date,
    createdAt,
    _id,
  } = booking;

  const bookedFor = new Date(date).toDateString();
  const bookedOn = new Date(createdAt).toDateString();

  const confirmDelete = async () => {
    if (window.confirm("Mark this booking as completed?")) {
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
        toast.success("Booking marked as completed");
        window.location.reload();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{tourName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{fullName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{userId}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{maxGroupSize}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{phone}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{bookedFor}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{bookedOn}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-800">Rs. {totalPrice}</td>
      <td className="px-4 py-3">
        <button
          onClick={confirmDelete}
          className="px-3 py-1.5 bg-gradient-to-r from-BaseColor to-BHoverColor text-white text-xs font-medium rounded-lg hover:shadow-md transition-all"
        >
          Complete
        </button>
      </td>
    </tr>
  );
};

export default AdminBookingCard;