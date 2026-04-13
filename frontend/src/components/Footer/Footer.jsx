import Logo from "./../../assets/images/logo3.png";
import React, { useContext } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BiChevronRight } from "react-icons/bi";

const Footer = () => {
  const { role } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();

  const navLinks = {
    user: [
      { name: "Home", path: "/home" },
      { name: "Tours", path: "/tours" },
      { name: "Gallery", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "My Trips", path: "/my-trips" },
      { name: "Mediators", path: "/mediators" },
    ],
    mediator: [
      { name: "Dashboard", path: "/mediator-dashboard" },
      { name: "Profile", path: "/mediator-profile" },
    ],
  };

  const quickLinks = role === "mediator" ? navLinks.mediator : navLinks.user;

  const socialLinks = [
    { icon: FaFacebookF, name: "Facebook", href: "#" },
    { icon: FaTwitter, name: "Twitter", href: "#" },
    { icon: FaInstagram, name: "Instagram", href: "#" },
    { icon: FaYoutube, name: "YouTube", href: "#" },
    { icon: FaGithub, name: "GitHub", href: "#" },
  ];

  if (role === "admin") return null;

  return (
    <footer className="bg-gradient-to-b from-forest-800 to-forest-900 text-white border-t-4 border-cta relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cta/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pt-16 pb-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <img
              src={Logo}
              alt="TravelNode"
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-body-sm leading-relaxed pr-4">
              Discover amazing destinations and create unforgettable memories
              with our curated travel experiences. Your journey begins here.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cta flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm group"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 text-gray-300 group-hover:text-forest-900 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-body-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full inline-block"></span> Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-body-sm text-gray-400 hover:text-white transition-colors duration-200 group"
                  >
                    <BiChevronRight className="w-4 h-4 text-accent group-hover:text-cta group-hover:translate-x-1 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-body-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-cta rounded-full inline-block"></span> Contact Info
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <FaMapMarkerAlt className="w-4 h-4 text-cta" />
                </div>
                <p className="text-body-sm text-gray-400 mt-1">
                  123 Travel Street, Adventure City, AC 12345
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <FaPhone className="w-4 h-4 text-accent" />
                </div>
                <p className="text-body-sm text-gray-400">+1 (234) 567-890</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <FaEnvelope className="w-4 h-4 text-cta" />
                </div>
                <p className="text-body-sm text-gray-400">
                  info@travelnode.com
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div>
            <h4 className="text-body-lg font-bold text-white mb-6 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-accent rounded-full inline-block"></span> Stay Updated
            </h4>
            <p className="text-body-sm text-gray-400 mb-5">
              Subscribe for exclusive deals and travel inspiration.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 text-body-sm focus:outline-none focus:border-cta/50 focus:ring-2 focus:ring-cta/20 transition-all shadow-inner"
              />
              <button className="w-full btn-cta text-body-sm !py-3.5 shadow-elevated">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption font-medium text-gray-500">
            © {currentYear} TravelNode. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-caption font-medium text-gray-500 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-caption font-medium text-gray-500 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/sitemap"
              className="text-caption font-medium text-gray-500 hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;