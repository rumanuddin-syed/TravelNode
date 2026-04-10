import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiSend, FiMail, FiCheck } from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
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
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input !pl-11"
            />
          </div>

          {email && !email.includes("@") && email.length > 3 && (
            <p className="text-caption text-danger flex items-center gap-1.5">
              <span className="w-1 h-1 bg-danger rounded-full" />
              Please enter a valid email address
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-cta"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-cta" />
                Subscribing...
              </>
            ) : (
              <>
                Subscribe Now
                <FiSend className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

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