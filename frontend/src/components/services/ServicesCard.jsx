import React, { useState } from 'react';

const ServicesCard = ({ service, index }) => {
  const { title, description, icon: Icon, color } = service;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
        {/* Icon with gradient background */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-xl blur-md opacity-75`}></div>
          <div className={`relative w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>

        {/* Title with gradient on hover */}
        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 group-hover:bg-gradient-to-r ${color} group-hover:bg-clip-text group-hover:text-transparent`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>

        {/* Learn more link */}
        <div className="flex items-center text-sm font-semibold">
          <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            Learn more
          </span>
          <svg 
            className={`w-4 h-4 ml-2 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-2 transition-all duration-300`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Decorative number */}
        <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 select-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default ServicesCard;