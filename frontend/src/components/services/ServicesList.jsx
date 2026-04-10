import React from 'react';
import ServicesCard from './ServicesCard';
import { MdHotel, MdOutlineTravelExplore } from "react-icons/md";
import { FaUmbrellaBeach } from "react-icons/fa";
import { IoMdCompass } from "react-icons/io";
import { GiMountainCave, GiIsland } from "react-icons/gi";

const ServicesList = () => {
  const services = [
    {
      title: 'Adventure Tours',
      description: 'Explore thrilling destinations with our guided adventure tours. From mountain trekking to desert safaris.',
      icon: GiMountainCave,
      color: 'forest-800',
    },
    {
      title: 'Travel Planning',
      description: 'Let us handle the details! We plan, you enjoy your dream vacation with personalized itineraries.',
      icon: MdOutlineTravelExplore,
      color: 'forest-700',
    },
    {
      title: 'Luxury Stays',
      description: 'Experience comfort and luxury with our carefully selected accommodations and premium resorts.',
      icon: MdHotel,
      color: 'accent',
    },
    {
      title: 'Island Getaways',
      description: 'Escape to paradise with our exclusive island packages. Sun, sand, and crystal clear waters await.',
      icon: GiIsland,
      color: 'sky-500',
    },
    {
      title: 'Cultural Experiences',
      description: 'Immerse yourself in local cultures with authentic experiences and guided historical tours.',
      icon: IoMdCompass,
      color: 'forest-600',
    },
    {
      title: 'Beach Retreats',
      description: 'Relax and unwind at the world\'s most beautiful beaches with our carefully curated beach packages.',
      icon: FaUmbrellaBeach,
      color: 'sky-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <ServicesCard key={index} service={service} index={index} />
      ))}
    </div>
  );
};

export default ServicesList;