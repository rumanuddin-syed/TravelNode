import React from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiCheck } from "react-icons/fi";

const AdminBookingCard = ({ booking }) => {
  const { tourName, fullName, userId, phone, totalPrice, maxGroupSize, startDate, endDate, createdAt, _id, status, paymentStatus } = booking;

  const bookedFor = `${startDate} - ${endDate}`;
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
        <div className="flex flex-col gap-1.5">
          <span className={`badge !text-[10px] ${
            paymentStatus === "paid" ? "bg-success/10 text-success" :
            paymentStatus === "failed" ? "bg-danger/10 text-danger" :
            paymentStatus === "pending_verification" ? "bg-sky-100 text-sky-800" :
            "bg-gray-100 text-gray-600"
          }`}>
            {paymentStatus?.replace("_", " ") || "UNPAID"}
          </span>
          {paymentStatus !== "paid" && (
             <button
              onClick={confirmDelete}
              className="inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-accent text-white text-[10px] font-bold rounded hover:bg-forest-700 transition-all"
            >
              Complete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AdminBookingCard;