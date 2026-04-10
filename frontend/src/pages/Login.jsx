import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import loginImg from "../assets/images/login2.png";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (!response.ok) {
        dispatch({ type: "LOGIN_FAIL", payload: res.message });
        toast.error(res.message);
      } else {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: res.data, token: res.token, role: res.role },
        });
        toast.success(res.message);
        if (res.role === "admin") navigate("/admin-dashboard");
        else if (res.role === "mediator") navigate("/mediator-dashboard");
        else navigate("/home");
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAIL", payload: err.message });
      toast.error("Server not responding");
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 card-elevated overflow-hidden">
        {/* Left — Illustration */}
        <div className="hidden lg:flex bg-gradient-forest p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cta/10 rounded-full blur-3xl" />
          <div className="relative text-center">
            <img src={loginImg} alt="Login" className="w-72 mx-auto mb-8 drop-shadow-2xl" />
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back!</h3>
            <p className="text-forest-200 text-body-sm">
              Sign in to access your trips, bookings, and personalized travel plans.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="section-overline">Welcome</span>
            <h2 className="text-display-sm mt-2 mb-1">Sign In</h2>
            <p className="text-body-sm text-text-secondary">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={loginHandler} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInput}
                  required
                  className="form-input !pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInput}
                  required
                  className="form-input !pl-11 !pr-11"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-body-sm font-medium text-accent hover:text-primary transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="w-full btn-cta group">
              Sign In
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-body-sm text-text-secondary mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-cta hover:text-cta-hover transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
