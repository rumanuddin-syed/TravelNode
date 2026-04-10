import React, { useContext } from "react";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

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
        window.location.reload();
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <tr className="table-row">
      <td>
        <img
          src={photo}
          alt={title}
          className="w-14 h-14 object-cover rounded-xl border border-border-light"
        />
      </td>
      <td className="font-medium">{title}</td>
      <td>{city}</td>
      <td>
        <span
          className={`badge ${
            featured
              ? "bg-forest-100 text-forest-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {featured ? "Yes" : "No"}
        </span>
      </td>
      <td>{maxGroupSize}</td>
      <td>{reviews?.length || 0}</td>
      <td>
        <div className="flex items-center gap-1.5">
          <Link
            to={`/update-tour/${_id}`}
            className="btn-icon !p-2"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-danger bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminToursCards;