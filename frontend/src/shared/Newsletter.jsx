import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { FiSend, FiMail, FiX } from "react-icons/fi";
import BASE_URL from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Newsletter = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
      checkSubscriptionStatus(user.email);
    }
  }, [user]);

  const checkSubscriptionStatus = async (userEmail) => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch(`${BASE_URL}/subscribe/status/${userEmail}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubscribed(data.isSubscribed);
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/subscribe/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setIsSubscribed(data.isSubscribed);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error("Failed to update subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="card p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-forest flex items-center justify-center flex-shrink-0">
            <FiMail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-body-lg font-bold text-text-primary">
              Stay Updated
            </h3>
            <p className="text-body-sm text-text-secondary mt-0.5">
              Get exclusive offers and travel inspiration
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["Weekly Updates", "Exclusive Deals", "Travel Tips"].map((tag) => (
            <span key={tag} className="badge-forest">
              {tag}
            </span>
          ))}
        </div>

        {/* Form */}
        {!user ? (
          <div className="text-center py-4 bg-background border border-border-light rounded-lg">
            <p className="text-text-secondary mb-3">Login to subscribe to our newsletter</p>
            <Link to="/login" className="btn-primary inline-block">
              Login Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleToggle} className="space-y-3">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                readOnly
                className="form-input !pl-11 bg-background text-text-muted cursor-not-allowed border-border-light"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingStatus}
              className={`w-full ${isSubscribed ? "btn-secondary !text-danger !border-danger hover:!bg-danger/10" : "btn-cta"}`}
            >
              {isSubmitting || isLoadingStatus ? (
                <>
                  <span className="spinner-cta" />
                  {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
                </>
              ) : isSubscribed ? (
                <>
                  Unsubscribe
                  <FiX className="w-4 h-4" />
                </>
              ) : (
                <>
                  Subscribe Now
                  <FiSend className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-border-light">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>🌟 Join 10,000+ subscribers</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              No spam ever
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;