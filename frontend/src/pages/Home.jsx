import React from "react";
import "tailwindcss/tailwind.css";
// Remove the heroBg import as it doesn't exist
import card01 from "../assets/images/gallery-01.jpg";
import card02 from "../assets/images/gallery-02.jpg";
import card03 from "../assets/images/gallery-03.jpg";
import SearchBar from "../shared/searchBar/SearchBar";
import ServicesList from "../components/services/ServicesList";
import FeaturedTourList from "../components/featruredTour/FeaturedTourList";
import { Link } from "react-router-dom";
import { BsArrowRight, BsStars, BsShieldCheck, BsMap } from "react-icons/bs";
import { FiCompass, FiCamera, FiHeart } from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlineUsers } from "react-icons/hi";
import { MdOutlineSupportAgent } from "react-icons/md";
import FaqList from "../components/Faq/FaqList";
import Testimonials from "../components/Testimonials/Testimonials";
import faqImg from "../assets/images/experience.png";
import ImagesGallery from "../components/Gallery/Gallery";
import Newsletter from "../shared/Newsletter";

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with full-width background */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            Explore the World with <br />
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">TravelNode</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            Discover amazing destinations, create unforgettable memories, and embark on the journey of a lifetime.
          </p>
          
          {/* Search Bar integrated */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { value: '500+', label: 'Destinations', icon: HiOutlineLocationMarker },
              { value: '10k+', label: 'Happy Travelers', icon: FiCompass },
              { value: '4.9', label: 'User Rating', icon: BsStars },
              { value: '24/7', label: 'Support', icon: MdOutlineSupportAgent },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section - with new layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Our <span className="text-BaseColor">Premium Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a range of services to make your travel experience seamless and memorable.
            </p>
          </div>
          <ServicesList />
        </div>
      </section>

      {/* Featured Tours Section with different background */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">Popular Choices</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Featured <span className="text-BaseColor">Tours</span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Embark on unforgettable journeys with our hand-picked featured tours.
              </p>
            </div>
            <Link 
              to="/tours" 
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-BaseColor font-semibold hover:underline"
            >
              <span>View All Tours</span>
              <BsArrowRight />
            </Link>
          </div>
          <FeaturedTourList />
        </div>
      </section>

      {/* Gallery Section with parallax effect */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-BaseColor rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">Visual Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
              Our <span className="text-BaseColor">Gallery</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Unveil travel wonders in our gallery, a snapshot of TravelNode's adventures.
            </p>
          </div>
          <ImagesGallery />
        </div>
      </section>

      {/* Testimonials Section with cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What Our <span className="text-BaseColor">Travelers Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read genuine reviews from our happy customers.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* FAQ Section with split layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <img 
                src={faqImg} 
                alt="Travel experience" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <span className="text-BaseColor font-semibold text-sm uppercase tracking-wider">Got Questions?</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  Frequently Asked{' '}
                  <span className="text-BaseColor">Questions</span>
                </h2>
                <p className="text-gray-600 mt-2">
                  Find answers to common queries about our services and travel experiences.
                </p>
              </div>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-BaseColor to-BHoverColor">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of happy travelers who have explored the world with us.</p>
          <Link
            to="/tours"
            className="inline-flex items-center space-x-2 bg-white text-BaseColor px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <span>Browse Tours</span>
            <BsArrowRight />
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-600">Get the latest updates on new tours and exclusive offers!</p>
              </div>
              <div>
                <Newsletter />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;