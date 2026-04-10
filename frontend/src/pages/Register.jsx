import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import registerImg from "../assets/images/register.png";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (!response.ok) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        if (formData.role === "mediator") {
          try {
            await fetch(`${BASE_URL}/mediator-profile/profile/${res.data._id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: res.data._id,
                bio: "",
                costPerHour: 0,
                languages: [],
                phone: "",
                experience: 0,
              }),
            });
          } catch (err) {
            console.error("Failed to create mediator profile:", err);
          }
        }
        navigate("/login");
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 card-elevated overflow-hidden">
        {/* Left — Form */}
        <div className="p-8 md:p-12 order-2 lg:order-1">
          <div className="mb-8">
            <span className="section-overline">Get Started</span>
            <h2 className="text-display-sm mt-2 mb-1">Create Account</h2>
            <p className="text-body-sm text-text-secondary">
              Join thousands of travelers worldwide
            </p>
          </div>

          <form onSubmit={registerHandler} className="space-y-5">
            <div>
              <label htmlFor="username" className="form-label">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInput}
                  required
                  className="form-input !pl-11"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  placeholder="Min 6 characters"
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

            {/* Role Selection */}
            <div>
              <label className="form-label">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "user" })}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    formData.role === "user"
                      ? "border-cta bg-cta-light text-primary font-semibold"
                      : "border-border-light bg-white text-text-secondary hover:border-forest-300"
                  }`}
                >
                  <span className="text-xl mb-1 block">🧳</span>
                  <span className="text-body-sm">Traveller</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "mediator" })}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    formData.role === "mediator"
                      ? "border-cta bg-cta-light text-primary font-semibold"
                      : "border-border-light bg-white text-text-secondary hover:border-forest-300"
                  }`}
                >
                  <span className="text-xl mb-1 block">🗣️</span>
                  <span className="text-body-sm">Mediator</span>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-cta group">
              Create Account
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-body-sm text-text-secondary mt-8">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cta hover:text-cta-hover transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Right — Illustration */}
        <div className="hidden lg:flex bg-gradient-forest p-12 items-center justify-center relative overflow-hidden order-1 lg:order-2">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-cta/10 rounded-full blur-3xl" />
          <div className="relative text-center">
            <img src={registerImg} alt="Register" className="w-72 mx-auto mb-8 drop-shadow-2xl" />
            <h3 className="text-2xl font-bold text-white mb-2">Join TravelNode</h3>
            <p className="text-forest-200 text-body-sm">
              Start your journey today with personalized trips and AI-powered planning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
