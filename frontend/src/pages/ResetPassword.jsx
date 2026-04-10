import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { FiLock, FiKey, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const res = await response.json();
      if (response.ok) {
        toast.success(res.message);
        navigate("/login");
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
              <FiKey className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-display-sm mb-1">Reset Password</h2>
            <p className="text-body-sm text-text-secondary">
              Enter the OTP sent to <span className="font-medium text-text-primary">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="otp" className="form-label">OTP Code</label>
              <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                required className="form-input text-center tracking-[0.3em] text-lg font-mono" placeholder="● ● ● ● ● ●" maxLength="6"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"} id="newPassword" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required className="form-input !pl-11 !pr-11"
                  placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required className="form-input !pl-11"
                  placeholder="Re-enter password"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-caption text-danger mt-1.5">Passwords don't match</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full btn-cta group">
              {loading ? (
                <><span className="spinner-cta" /> Resetting...</>
              ) : (
                <>Reset Password <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center text-body-sm text-text-secondary mt-6">
            <Link to="/login" className="font-medium text-accent hover:text-primary transition-colors">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;