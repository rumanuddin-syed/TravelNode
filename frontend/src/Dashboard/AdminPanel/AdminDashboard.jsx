import React from "react";
import { Link } from "react-router-dom";
import { BiBookmark, BiUser, BiMap, BiMoney } from "react-icons/bi";

const AdminDashboard = () => {
  const adminMenuItems = [
    {
      title: "All Bookings",
      description: "View and manage customer bookings",
      icon: BiBookmark,
      path: "/all-booking",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "All Tours",
      description: "Manage tour listings and details",
      icon: BiMap,
      path: "/all-tours",
      color: "from-green-400 to-green-600",
    },
    {
      title: "Create Tour",
      description: "Add new tour to the platform",
      icon: BiMap,
      path: "/create",
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Mediator Management",
      description: "Assign language mediators to bookings",
      icon: BiUser,
      path: "/mediator-management",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Mediator Costs",
      description: "Set hourly rates and duration for mediators",
      icon: BiMoney,
      path: "/mediator-cost",
      color: "from-red-400 to-red-600",
    },
  ];

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage tours, bookings, and mediators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${item.color} h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
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