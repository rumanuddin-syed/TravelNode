import React from "react";
import "tailwindcss/tailwind.css";
import card01 from "../assets/images/gallery-01.jpg";
import card02 from "../assets/images/gallery-02.jpg";
import card03 from "../assets/images/gallery-03.jpg";
import SearchBar from "../shared/searchBar/SearchBar";
import ServicesList from "../components/services/ServicesList";
import FeaturedTourList from "../components/featruredTour/FeaturedTourList";
import { Link } from "react-router-dom";
import { BsArrowRight, BsStars } from "react-icons/bs";
import { FiCompass, FiCamera } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import FaqList from "../components/Faq/FaqList";
import Testimonials from "../components/Testimonials/Testimonials";
import faqImg from "../assets/images/experience.png";
import ImagesGallery from "../components/Gallery/Gallery";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <BsStars className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Your Adventure Awaits</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Plan Your Perfect Trip with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TravelNode
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Discover amazing destinations, create unforgettable memories, and embark on the journey of a lifetime. Your next adventure starts here.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tours"
                  className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10">Explore Tours</span>
                  <BsArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  <FiCamera className="w-5 h-5" />
                  <span>View Gallery</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: '500+', label: 'Destinations', icon: HiOutlineLocationMarker },
                  { value: '10k+', label: 'Happy Travelers', icon: FiCompass },
                  { value: '4.9', label: 'User Rating', icon: BsStars }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Image Grid */}
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src={card01} 
                    alt="Travel destination" 
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src={card02} 
                    alt="Travel destination" 
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <div className="pt-12">
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src={card03} 
                    alt="Travel destination" 
                    className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="relative -mt-10 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Best Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Empowering Your Journey: Unrivaled Services Tailored to Elevate Your Experience.
            </p>
          </div>
          <ServicesList />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Visual Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Gallery</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unveil travel wonders in our gallery, a snapshot of TravelNode's adventures.
            </p>
          </div>
          <ImagesGallery />
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Popular Choices</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Tours
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Embark on Unforgettable Journeys: Discover Our Featured Tours, Where Adventure Meets Extraordinary Experiences.
            </p>
          </div>
          <FeaturedTourList />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
              What Our <span className="text-yellow-300">Travelers Say</span>
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Read what our travelers have to say in their own words. Real stories, real experiences.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <img 
                src={faqImg} 
                alt="Travel experience" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Got Questions?</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  Frequently Asked{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Questions
                  </span>
                </h2>
              </div>
              <FaqList />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;