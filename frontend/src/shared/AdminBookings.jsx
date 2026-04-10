import React from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiCheck } from "react-icons/fi";

const AdminBookingCard = ({ booking }) => {
  const { tourName, fullName, userId, phone, totalPrice, maxGroupSize, date, createdAt, _id } = booking;

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
    <tr className="table-row">
      <td className="font-medium">{tourName}</td>
      <td>{fullName}</td>
      <td className="text-text-muted text-caption font-mono">{userId}</td>
      <td>{maxGroupSize}</td>
      <td>{phone}</td>
      <td>{bookedFor}</td>
      <td className="text-caption">{bookedOn}</td>
      <td className="font-semibold text-primary">₹{totalPrice}</td>
      <td>
        <button
          onClick={confirmDelete}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent text-white text-caption font-medium rounded-lg hover:bg-forest-700 transition-all"
        >
          <FiCheck className="w-3.5 h-3.5" />
          Complete
        </button>
      </td>
    </tr>
  );
};

export default AdminBookingCard;