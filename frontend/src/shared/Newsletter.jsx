import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaEnvelope, FaCheckCircle } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        <div className="flex items-center space-x-2">
          <FaCheckCircle className="w-5 h-5 text-green-500" />
          <span>Successfully subscribed to newsletter!</span>
        </div>,
        {
          icon: false,
          className: "bg-gradient-to-r from-green-500 to-green-600 text-white",
        }
      );
      console.log(`Subscribed with email: ${email}`);
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Animated background effect with BaseColor */}
        <div className="absolute -inset-1 bg-gradient-to-r from-BaseColor/20 to-BHoverColor/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

        <div className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Header Section with Icon */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-lg blur opacity-50"></div>
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-r from-BaseColor to-BHoverColor flex items-center justify-center">
                <FaEnvelope className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-BaseColor">Stay Updated</h3>
              <p className="text-sm text-gray-500 mt-1">
                Get exclusive offers and travel inspiration
              </p>
            </div>
          </div>

          {/* Benefits Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Weekly Updates", "Exclusive Deals", "Travel Tips"].map(
              (benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1 text-xs font-medium text-BaseColor bg-red-50 rounded-full border border-red-100"
                >
                  {benefit}
                </span>
              )
            )}
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-xl blur transition-opacity duration-300 ${
                  isFocused ? "opacity-50" : "opacity-0"
                }`}
              ></div>

              <div className="relative flex items-center">
                <FaEnvelope
                  className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${
                    isFocused ? "text-BaseColor" : "text-gray-400"
                  }`}
                />

                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-BaseColor focus:ring-1 focus:ring-BaseColor transition-all duration-300"
                />
              </div>
            </div>

            {/* Error message placeholder */}
            {email && !email.includes("@") && email.length > 3 && (
              <p className="text-xs text-red-500 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                Please enter a valid email address
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-xl opacity-100"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-BHoverColor to-BaseColor rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex items-center justify-center space-x-3 px-6 py-4">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white font-semibold">
                      Subscribing...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-semibold">
                      Subscribe Now
                    </span>
                    <FaPaperPlane className="w-4 h-4 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-gray-400 text-center mt-4">
            By subscribing, you agree to our{" "}
            <a
              href="/privacy"
              className="text-BaseColor hover:text-BHoverColor underline decoration-dotted underline-offset-2 transition-colors"
            >
              Privacy Policy
            </a>
          </p>

          {/* Success Rate Indicator */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>🌟 Join 10,000+ subscribers</span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                No spam, unsubscribe anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;