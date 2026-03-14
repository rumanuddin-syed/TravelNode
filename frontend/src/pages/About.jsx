import React from "react";
import ImagesGallery from "../components/Gallery/Gallery";

const About = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">
          Visual Journey
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
          Our <span className="text-BaseColor">Gallery</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Unveil travel wonders in our gallery, a snapshot of TravelNode's adventures.
        </p>

        {/* Gallery Component */}
        <div className="mt-8">
          <ImagesGallery />
        </div>
      </div>
    </section>
  );
};

export default About;