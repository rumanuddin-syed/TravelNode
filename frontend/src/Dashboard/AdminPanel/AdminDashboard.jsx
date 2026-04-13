import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BiBookmark, BiUser, BiMap, BiMoney } from "react-icons/bi";
import { FiMap, FiUsers, FiDollarSign, FiPlusCircle, FiList, FiStar, FiMessageSquare } from "react-icons/fi";

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const adminMenuItems = [
    {
      title: "All Bookings",
      description: "View and manage customer bookings",
      icon: FiList,
      path: "/all-booking",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      title: "All Tours",
      description: "Manage tour listings and details",
      icon: FiMap,
      path: "/all-tours",
      gradient: "from-primary to-accent",
    },
    {
      title: "Create Tour",
      description: "Add new tour to the platform",
      icon: FiPlusCircle,
      path: "/create",
      gradient: "from-sky-500 to-cta",
    },
    {
      title: "Mediator Management",
      description: "Assign language mediators to bookings",
      icon: FiUsers,
      path: "/mediator-management",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      title: "Mediator Costs",
      description: "Set hourly rates and duration for mediators",
      icon: FiDollarSign,
      path: "/mediator-cost",
      gradient: "from-rose-400 to-red-500",
    },
    {
      title: "Manage Payments",
      description: "Verify manual payment screenshots and confirm bookings",
      icon: FiDollarSign,
      path: "/admin-payments",
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      title: "Reviews Management",
      description: "Manage and highlight traveler reviews",
      icon: FiStar,
      path: "/admin-reviews",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Platform Analytics",
      description: "View revenue, insights, and performance numbers",
      icon: FiDollarSign,
      path: "/admin-analytics",
      gradient: "from-slate-600 to-slate-800",
    },
    {
      title: "Support Desk",
      description: "Manage real-time customer support conversations",
      icon: FiMessageSquare,
      path: "/admin-support",
      gradient: "from-emerald-400 to-cyan-500",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="section-overline">Admin Space</span>
          <h1 className="text-display-md text-text-primary mt-2 mb-2">Admin Dashboard</h1>
          <p className="text-body-sm text-text-secondary">Manage tours, bookings, and mediators from one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="card group cursor-pointer border-none shadow-sm hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6 pb-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-body-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-text-secondary leading-relaxed line-clamp-2 max-w-[200px]">
                      {item.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-forest-50/50 px-6 py-3 border-t border-border-light group-hover:bg-forest-50 transition-colors">
                  <span className="text-caption font-bold text-accent group-hover:text-primary flex items-center gap-1.5 transition-colors">
                    Manage <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;