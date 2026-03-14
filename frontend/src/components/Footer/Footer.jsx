import Logo from "./../../assets/images/logo3.png";
import React, { useContext, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Newsletter from "../../shared/Newsletter";
import { AuthContext } from "../../context/AuthContext";

const Footer = () => {
  const { role } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();

  // Quick links for better navigation
  const quickLinks = [
    { name: "Home", path: "/home" },
    { name: "Tours", path: "/tours" },
    { name: "Gallery", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  // Social media links with hover colors
  const socialLinks = [
    { icon: FaFacebookF, name: "Facebook", color: "hover:bg-[#1877f2]", href: "#" },
    { icon: FaTwitter, name: "Twitter", color: "hover:bg-[#1da1f2]", href: "#" },
    { icon: FaInstagram, name: "Instagram", color: "hover:bg-[#e4405f]", href: "#" },
    { icon: FaYoutube, name: "YouTube", color: "hover:bg-[#ff0000]", href: "#" },
    { icon: FaGithub, name: "GitHub", color: "hover:bg-[#333]", href: "#" },
  ];

  if (role === "admin") return null;

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-6"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-gray-900"
          ></path>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Section - 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <div className="relative group inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <img
                  src={Logo}
                  alt="Trips Travels Logo"
                  className="relative h-16 w-auto object-contain"
                />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Discover amazing destinations and create unforgettable memories with our curated travel experiences. Your journey begins here.
              </p>
            </div>

            {/* Contact Information with Icons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-300">123 Travel Street, Adventure City, AC 12345</p>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
                    <FaPhone className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-300">+1 (234) 567-890</p>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
                    <FaEnvelope className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-300">info@travelnode.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section - 5 columns on large screens */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Get the latest updates on new tours and exclusive offers!
              </p>
            </div>
            
            <Newsletter />

            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 flex items-center">
              &copy; {currentYear} Trips Travels. 
              <span className="mx-2">•</span>
              All rights reserved.
            </p>
            <p className="text-sm text-gray-400 flex items-center">
              Made with <FaHeart className="w-3 h-3 text-red-500 mx-1 animate-pulse" /> for travelers
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/sitemap" className="text-xs text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;