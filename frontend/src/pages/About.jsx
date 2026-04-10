import React, { useEffect } from "react";
import ImagesGallery from "../components/Gallery/Gallery";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-background min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <span className="section-overline">Visual Journey</span>
        <h1 className="text-display-md text-text-primary mt-2 mb-4">
          Our <span className="text-primary">Gallery</span>
        </h1>
        <p className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-16">
          Unveil travel wonders in our gallery, a snapshot of TravelNode's adventures tailored for your inspiration.
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