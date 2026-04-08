import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import BASE_URL from "../utils/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent to your email");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 mt-2">Enter your email to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-BaseColor hover:underline inline-flex items-center gap-1">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;