import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiMail, FiArrowRight } from "react-icons/fi";

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
      const res = await response.json();
      if (response.ok) {
        toast.success(res.message);
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-elevated p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
              <FiMail className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-display-sm mb-1">Forgot Password?</h2>
            <p className="text-body-sm text-text-secondary">
              Enter your email and we'll send you a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-cta group">
              {loading ? (
                <><span className="spinner-cta" /> Sending...</>
              ) : (
                <>Send Reset Code <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;