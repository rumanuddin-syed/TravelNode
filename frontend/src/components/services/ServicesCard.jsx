import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

const ServicesCard = ({ service, index }) => {
  const { title, description, icon: Icon, color } = service;

  return (
    <div className="group card-hover p-6 relative overflow-hidden">
      {/* Decorative number */}
      <span className="absolute top-4 right-5 text-6xl font-extrabold text-forest-50 select-none transition-colors duration-300 group-hover:text-forest-100">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div className={`relative w-14 h-14 rounded-2xl bg-${color}/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-7 h-7 text-${color}`} />
      </div>

      {/* Title */}
      <h3 className="text-body-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-body-sm text-text-secondary leading-relaxed mb-5">
        {description}
      </p>

      {/* Learn more link */}
      <div className="flex items-center gap-1.5 text-body-sm font-semibold text-accent group-hover:text-primary transition-colors duration-200">
        <span>Learn more</span>
        <FiArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </div>
    </div>
  );
};

export default ServicesCard;