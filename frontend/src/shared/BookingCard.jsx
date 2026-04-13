import React, { useContext, useState } from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiX, FiCalendar, FiUsers, FiLoader } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const BookingCard = ({ booking, displayMode = "row", onDeleteSuccess }) => {
  const { tourName, totalPrice, maxGroupSize, startDate, endDate, _id, mediatorId, status, paymentStatus } = booking;
  const { token } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    const result = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (result) {
      deleteBooking();
    }
  };

  const deleteBooking = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/booking/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const resData = await response.json();

      if (response.ok) {
        toast.success("Booking cancelled successfully");
        if (onDeleteSuccess) {
          onDeleteSuccess(_id);
        }
      } else {
        toast.error(resData.message || "Failed to cancel booking");
        setIsDeleting(false);
      }
    } catch (err) {
      toast.error("Server not responding");
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formattedDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  if (displayMode === "row") {
    return (
      <tr className="table-row">
        <td className="font-medium">
          {tourName}
          {mediatorId?.userId?.username && (
            <div className="flex items-center gap-1.5 text-[11px] text-cta mt-1 bg-sky-50 w-fit px-2 py-0.5 rounded-full font-bold">
              <FaUserTie className="w-2.5 h-2.5" />
              Mediator: {mediatorId.userId.username}
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              paymentStatus === "paid" ? "bg-success/10 text-success" :
              paymentStatus === "failed" ? "bg-danger/10 text-danger" :
              paymentStatus === "pending_verification" ? "bg-sky-100 text-sky-800" :
              "bg-gray-100 text-gray-600"
            }`}>
              {paymentStatus?.replace("_", " ") || "UNPAID"}
            </span>
            {(paymentStatus === "unpaid" || paymentStatus === "failed") && (
              <a href={`/payment-instructions/${_id}`} className="text-[10px] text-primary hover:underline font-bold">
                PAY NOW
              </a>
            )}
          </div>
        </td>
        <td>{formattedDateRange}</td>
        <td>{maxGroupSize}</td>
        <td className="font-semibold text-primary">₹{totalPrice}</td>
        <td className="text-right">
          <button
            onClick={confirmDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 text-body-sm text-danger bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 rounded-lg transition-colors font-medium"
          >
            {isDeleting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <FiX className="w-4 h-4" />
                Cancel
              </>
            )}
          </button>
        </td>
      </tr>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-body-md font-semibold text-text-primary">
          {tourName}
        </h3>
        <button
          onClick={confirmDelete}
          disabled={isDeleting}
          className="p-1.5 text-danger hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
          aria-label="Cancel booking"
        >
          {isDeleting ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiX className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-body-sm text-text-secondary">
          <FiCalendar className="w-4 h-4 mr-2 text-accent" />
          {formattedDateRange}
        </div>
        <div className="flex items-center text-body-sm text-text-secondary">
          <FiUsers className="w-4 h-4 mr-2 text-accent" />
          {maxGroupSize} guests
        </div>
        {mediatorId?.userId?.username && (
          <div className="flex items-center text-body-sm text-cta font-bold">
            <FaUserTie className="w-4 h-4 mr-2" />
            Mediator: {mediatorId.userId.username}
          </div>
        )}
        <div className="flex items-center gap-2 pt-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              paymentStatus === "paid" ? "bg-success/10 text-success" :
              paymentStatus === "failed" ? "bg-danger/10 text-danger" :
              paymentStatus === "pending_verification" ? "bg-sky-100 text-sky-800" :
              "bg-gray-100 text-gray-600"
            }`}>
              {paymentStatus?.replace("_", " ") || "UNPAID"}
            </span>
            {(paymentStatus === "unpaid" || paymentStatus === "failed") && (
              <a href={`/payment-instructions/${_id}`} className="text-[10px] text-primary hover:underline font-bold">
                {paymentStatus === "failed" ? "RE-UPLOAD PROOF" : "PAY NOW"}
              </a>
            )}
        </div>
        <p className="text-body-md font-bold text-primary">₹{totalPrice}</p>
      </div>
    </div>
  );
};

export default BookingCard;