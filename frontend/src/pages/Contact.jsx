import React from "react";

const Contact = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Contact <span className="text-BaseColor">Us</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Got any issue? Want to reach us? Let us know.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form action="#" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@tmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                placeholder="How can we help you?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Leave a message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor/20 focus:border-BaseColor transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-BaseColor to-BHoverColor text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;