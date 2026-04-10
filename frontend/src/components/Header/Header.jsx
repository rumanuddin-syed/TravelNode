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

  // Dynamic Transparency Logic
  const isHomePage = location.pathname === "/home" || location.pathname === "/";
  const shouldBeTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset;
      setIsScrolled(currentScrollTop > 20);
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
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
    ],
  };

  const currentNavItems = role === "admin" ? navItems.admin : navItems.user;

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed w-full z-50 transition-all duration-300 bg-gradient-to-r from-forest-900 via-primary to-forest-800 border-b-2 border-cta shadow-elevated ${isVisible ? "translate-y-0" : "-translate-y-full"} ${isScrolled ? "py-2" : "py-3"}`}
      >
        <nav className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              {role === "admin" ? (
                <div className="flex items-center gap-2">
                  <img
                    src={Logo}
                    alt="TravelNode"
                    className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                  />
                  <span className="bg-cta text-forest-900 text-caption font-bold px-3 py-1 rounded-lg shadow-sm">Admin</span>
                </div>
              ) : (
                <Link to="/" className="block">
                  <img
                    src={Logo}
                    alt="TravelNode"
                    className="h-9 md:h-11 w-auto object-contain transition-opacity hover:opacity-80 brightness-0 invert"
                  />
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 rounded-xl px-2 py-1">
                {currentNavItems.map((item) => {
                  const isActive = isActivePath(item.path);
                  return (
                     <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-4 py-2 rounded-lg text-body-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-white text-primary shadow-sm"
                          : "text-white/80 hover:text-white hover:bg-white/15"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={
                      role === "user"
                        ? "/my-account"
                        : role === "mediator"
                        ? "/mediator-dashboard"
                        : "#"
                    }
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-200 group bg-white/10 hover:bg-white/20 border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-body-sm font-bold text-white">
                      {user.username}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl transition-all duration-200 text-white/70 hover:text-white hover:bg-red-500/20"
                    title="Logout"
                  >
                    <BiLogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <button className="px-5 py-2.5 rounded-xl text-body-sm font-bold text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="bg-cta text-forest-900 border border-cta hover:bg-sky-400 font-bold px-5 py-2.5 rounded-xl text-body-sm transition-all duration-300 shadow-sm">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right */}
            <div className="flex items-center gap-2 lg:hidden">
              {user && (
                <Link
                  to={
                    role === "user"
                      ? "/my-account"
                      : role === "mediator"
                      ? "/mediator-dashboard"
                      : "#"
                  }
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold bg-white/20 text-white border border-white/30"
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Link>
              )}
              <button
                onClick={handleMenuToggle}
                className="p-2 rounded-xl transition-colors duration-200 bg-white/10 text-white hover:bg-white/20 border border-white/20"
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

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-forest-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleMenuToggle}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-elevated z-50 transform transition-transform duration-300 ease-smooth lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <img src={Logo} alt="TravelNode" className="h-8 w-auto" />
            <button
              onClick={handleMenuToggle}
              className="btn-icon"
            >
              <IoClose className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleMenuToggle}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-forest-100 text-primary font-bold"
                        : "text-text-secondary font-semibold hover:bg-forest-50 hover:text-primary"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-accent" : "text-text-muted"
                      }`}
                    />
                    <span className="text-body-sm">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-5 border-t border-border-light bg-background/50">
            {user ? (
              <div className="space-y-3">
                <Link
                  to={
                    role === "user"
                      ? "/my-account"
                      : role === "mediator"
                      ? "/mediator-dashboard"
                      : "#"
                  }
                  onClick={handleMenuToggle}
                  className="flex items-center gap-3 p-3 bg-white border border-border-light shadow-sm rounded-xl hover:border-forest-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-forest flex items-center justify-center text-white font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-text-primary">
                      {user.username}
                    </p>
                    <p className="text-caption font-semibold text-text-muted capitalize">
                      {role}
                    </p>
                  </div>
                </Link>
                {role === "mediator" && (
                  <Link
                    to="/mediator-profile"
                    onClick={handleMenuToggle}
                    className="block w-full text-center btn-secondary !py-2.5 text-body-sm shadow-sm"
                  >
                    Edit Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-danger bg-red-50 hover:bg-red-100 transition-colors text-body-sm font-bold"
                >
                  <BiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
               <div className="space-y-2.5">
                <Link
                  to="/login"
                  onClick={handleMenuToggle}
                  className="block w-full"
                >
                  <button className="w-full btn-secondary text-body-sm shadow-sm font-bold">
                    Sign In
                  </button>
                </Link>
                <Link
                  to="/register"
                  onClick={handleMenuToggle}
                  className="block w-full"
                >
                  <button className="w-full btn-cta text-body-sm shadow-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer so content doesn't jump when the fixed header switches styles. Always present. */}
      <div className={`${isScrolled ? "h-[68px]" : "h-[76px]"}`} />
    </>
  );
};

export default Header;