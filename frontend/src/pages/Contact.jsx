import React, { useEffect } from "react";
import { FiMail, FiMessageSquare, FiSend } from "react-icons/fi";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-background min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-overline">Get in Touch</span>
          <h2 className="text-display-md text-text-primary mt-2 flex justify-center items-center gap-3">
            Contact <span className="text-primary">Us</span>
          </h2>
          <p className="text-body-lg text-text-secondary mt-4 max-w-xl mx-auto">
            Got any issue? Want to reach us? Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="card md:p-10 p-6 shadow-elevated">
          <form action="#" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    id="email"
                    placeholder="example@email.com"
                    className="form-input !pl-11"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help you?"
                    className="form-input !pl-11"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Leave a detailed message..."
                  className="form-textarea"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border-light border-dashed mt-8">
              <button
                type="submit"
                className="btn-cta-lg w-full shadow-elevated group"
              >
                Send Message <FiSend className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
        
        {/* Additional Contact Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-2xl border border-border-light shadow-sm">
            <div className="w-12 h-12 bg-forest-50 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-text-primary mb-1">Email</h4>
            <p className="text-body-sm text-text-secondary">support@travelnode.com</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-border-light shadow-sm">
            <div className="w-12 h-12 bg-sky-50 text-cta rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-text-primary mb-1">Phone</h4>
            <p className="text-body-sm text-text-secondary">+1 (555) 123-4567</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-border-light shadow-sm">
            <div className="w-12 h-12 bg-forest-50 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-text-primary mb-1">Office</h4>
            <p className="text-body-sm text-text-secondary">123 Travel Avenue, NY</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;