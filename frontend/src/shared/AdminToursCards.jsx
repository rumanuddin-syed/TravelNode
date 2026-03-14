import React, { useContext } from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AdminToursCards = ({ tour }) => {
  const { token } = useContext(AuthContext);
  const { title, city, maxGroupSize, featured, reviews, photo, _id } = tour;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this Tour permanently?")) {
      deleteTour();
    }
  };

  const deleteTour = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tour/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
      } else {
        toast.success(message);
        // Optionally refresh the list – here we reload for simplicity
        window.location.reload();
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <img
          src={photo}
          alt={title}
          className="w-16 h-16 object-cover rounded-lg shadow-sm"
        />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{title}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{city}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            featured === "true"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {featured ? "Yes" : "No"}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{maxGroupSize}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{reviews?.length || 0}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/update-tour/${_id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit size={18} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminToursCards;