import React, { useState, useRef, useEffect, useContext } from "react";
import Logo from "./../../assets/images/logo3.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { BiMenu, BiUser, BiLogOut, BiHome, BiMap, BiImage, BiEnvelope, BiCalendar, BiPlus, BiBookmark } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, dispatch, role } = useContext(AuthContext);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTop = useRef(0);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset;
      
      // Update scrolled state for background change (only for shadow)
      setIsScrolled(currentScrollTop > 20);
      
      // Hide/show header on scroll direction
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollTop.current = currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    handleMenuToggle();
    navigate("/home");
    toast.success("Successfully logged out!");
  };

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Navigation items with icons
  const navItems = {
    user: [
      { path: "/home", label: "Home", icon: BiHome },
      { path: "/tours", label: "Tours", icon: BiMap },
      { path: "/mediators", label: "Mediators", icon: BiUser },
      { path: "/about", label: "Gallery", icon: BiImage },
      { path: "/contact", label: "Contact", icon: BiEnvelope },
      { path: "/my-trips", label: "My Trips", icon: BiCalendar },
    ],
    admin: [
      { path: "/admin-dashboard", label: "Dashboard", icon: BiBookmark },
      { path: "/all-booking", label: "Bookings", icon: BiBookmark },
      { path: "/all-tours", label: "Tours", icon: BiMap },
      { path: "/create", label: "Create", icon: BiPlus },
    ]
  };

  const currentNavItems = role === "admin" ? navItems.admin : navItems.user;

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed w-full z-50 transition-all duration-500 bg-white shadow-sm ${
          isScrolled ? "shadow-md py-2" : "py-4"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <div className="relative group">
              {role === "admin" ? (
                <div className="relative group flex items-center">
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-300"></div>

                {/* Logo */}
                <img
                  src={Logo}
                  alt="Travel Node Logo"
                  className="relative h-24 md:h-28 lg:h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              ) : (
                <Link to={"/"} className="block">
                  <div className="h-10 md:h-12 transform transition-transform hover:scale-105">
                    <img src={Logo} alt="Logo" className="h-full w-auto" />
                  </div>
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-300 group ${
                      isActivePath(item.path)
                        ? "text-BaseColor bg-BaseColor/10"
                        : "text-gray-700 hover:text-BaseColor hover:bg-BaseColor/10"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                    {isActivePath(item.path) && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-BaseColor rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to={
                      role === "user" ? "/my-account" :
                      role === "mediator" ? "/mediator-dashboard" :
                      "#"
                    }
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-BaseColor to-BHoverColor flex items-center justify-center text-white group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      <BiUser className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user.username}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-BaseColor hover:bg-BaseColor/10 transition-all duration-300 group"
                  >
                    <BiLogOut className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <button className="px-5 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-BaseColor hover:bg-BaseColor/10 transition-all duration-300">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-BaseColor to-BHoverColor hover:from-BaseColor/90 hover:to-BHoverColor/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 md:hidden">
              {user && (
                <Link
                  to={
                    role === "user" ? "/my-account" :
                    role === "mediator" ? "/mediator-dashboard" :
                    "#"
                  }
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-BaseColor to-BHoverColor flex items-center justify-center text-white shadow-md"
                >
                  <BiUser className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={handleMenuToggle}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <IoClose className="w-6 h-6" />
                ) : (
                  <BiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleMenuToggle}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="h-8">
              <img src={Logo} alt="Logo" className="h-full w-auto" />
            </div>
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            >
              <IoClose className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={handleMenuToggle}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-BaseColor/10 to-BHoverColor/10 text-BaseColor"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-BaseColor" : "text-gray-400"}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-2 bg-BaseColor rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <Link
                  to={
                    role === "user" ? "/my-account" :
                    role === "mediator" ? "/mediator-dashboard" :
                    "#"
                  }
                  onClick={handleMenuToggle}
                  className="block"
                >
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-BaseColor to-BHoverColor flex items-center justify-center text-white">
                      <BiUser className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{role}</p>
                    </div>
                  </div>
                </Link>
                {role === "mediator" && (
                  <Link
                    to="/mediator-profile"
                    onClick={handleMenuToggle}
                    className="w-full block px-4 py-3 rounded-xl text-gray-700 bg-blue-50 hover:bg-blue-100 text-sm font-medium transition-all duration-300"
                  >
                    Edit Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-600 hover:text-BaseColor hover:bg-BaseColor/10 transition-all duration-300"
                >
                  <BiLogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={handleMenuToggle}
                  className="block w-full"
                >
                  <button className="w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                    Login
                  </button>
                </Link>
                <Link
                  to="/register"
                  onClick={handleMenuToggle}
                  className="block w-full"
                >
                  <button className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-BaseColor to-BHoverColor hover:from-BaseColor/90 hover:to-BHoverColor/90 shadow-md transition-all duration-300">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;