import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "../App.css";

import heroImg01 from "../assets/images/banner-01.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import heroImg03 from "../assets/images/front-02.jpg";
import experienceImg from "../assets/images/experience.png";

import SearchBar from "../shared/searchBar/SearchBar";
import ServicesList from "../components/services/ServicesList";
import FeaturedTourList from "../components/featruredTour/FeaturedTourList";
import ImagesGallery from "../components/Gallery/Gallery";
import Testimonials from "../components/Testimonials/Testimonials";
import FaqList from "../components/Faq/FaqList";
import Newsletter from "../shared/Newsletter";

import { FiArrowRight, FiMapPin, FiCalendar, FiShield, FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  const heroSlides = [
    {
      image: heroImg01,
      overline: "Discover the World",
      title: "Adventure Awaits\nBeyond Borders",
      subtitle: "Explore curated travel experiences with expert guides and unforgettable destinations.",
    },
    {
      image: heroImg02,
      overline: "Plan Your Journey",
      title: "Travel Smart\nTravel Better",
      subtitle: "AI-powered trip planning and personalized itineraries for every kind of traveler.",
    },
    {
      image: heroImg03,
      overline: "Create Memories",
      title: "Your Story\nStarts Here",
      subtitle: "From cultural immersions to beach retreats — find experiences that move you.",
    },
  ];

  const stats = [
    { value: "12K+", label: "Happy Travelers", icon: FiAward },
    { value: "500+", label: "Destinations", icon: FiMapPin },
    { value: "98%", label: "Satisfaction Rate", icon: FiShield },
  ];

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[85vh] min-h-[600px]">
        <Swiper
          modules={[EffectFade, Autoplay, Pagination]}
          effect="fade"
          speed={1200}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.overline}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-forest-900/85 via-forest-900/50 to-transparent" />

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center">
                  <div className="max-w-2xl pt-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-caption font-semibold text-cta mb-6">
                      <span className="w-1.5 h-1.5 bg-cta rounded-full animate-pulse" />
                      {slide.overline}
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight whitespace-pre-line mb-6">
                      {slide.title}
                    </h1>

                    <p className="text-body-lg text-white/80 max-w-lg mb-8 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link to="/tours" className="btn-cta-lg group">
                        Explore Tours
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/my-trips"
                        className="btn px-8 py-4 text-body-lg bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/20 transition-all"
                      >
                        Plan a Trip
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="bg-white/95 backdrop-blur-md rounded-t-2xl shadow-elevated grid grid-cols-3 divide-x divide-border-light">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-5 md:p-6">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-primary">{stat.value}</p>
                      <p className="text-caption text-text-muted">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <section className="relative z-20 -mt-4 mb-20">
        <SearchBar />
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 px-5 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-overline">What We Offer</span>
          <h2 className="section-title mt-2 mb-3">
            Premium Travel <span className="text-gradient-forest">Services</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Everything you need for an extraordinary journey, all in one place.
          </p>
        </div>
        <ServicesList />
      </section>

      {/* ===== FEATURED TOURS ===== */}
      <section className="py-20 px-5 lg:px-8 bg-forest-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-overline">Top Picks</span>
            <h2 className="section-title mt-2 mb-3">
              Featured <span className="text-gradient-forest">Tours</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Hand-picked destinations for unforgettable experiences.
            </p>
          </div>
          <FeaturedTourList />
        </div>
      </section>

      {/* ===== EXPERIENCE / COUNTER ===== */}
      <section className="py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-forest-100 rounded-3xl" />
              <img
                src={experienceImg}
                alt="Travel experience"
                className="relative rounded-3xl w-full object-cover shadow-elevated"
              />
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-4 md:right-8 bg-white rounded-2xl shadow-elevated p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-cta" />
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">12+ Years</p>
                  <p className="text-caption text-text-muted">Of Experience</p>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="lg:pl-8">
              <span className="section-overline">Why Choose Us</span>
              <h2 className="section-title mt-2 mb-4">
                We Create <span className="text-gradient-forest">Unforgettable</span> Experiences
              </h2>
              <p className="text-body-md text-text-secondary mb-8 leading-relaxed">
                With years of expertise and a passion for discovery, we craft
                journeys that go beyond sightseeing. Every trip is designed to
                create lasting memories and meaningful connections.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { value: "12K+", label: "Travelers" },
                  { value: "500+", label: "Tours" },
                  { value: "15+", label: "Years" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-forest-50 rounded-2xl">
                    <p className="text-display-sm text-primary">{stat.value}</p>
                    <p className="text-caption text-text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link to="/tours" className="btn-cta group">
                Start Your Journey
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-20 px-5 lg:px-8 bg-forest-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-overline">Inspiration</span>
            <h2 className="section-title mt-2 mb-3">
              Travel <span className="text-gradient-forest">Gallery</span>
            </h2>
            <p className="section-subtitle mx-auto">
              A glimpse into the breathtaking destinations waiting for you.
            </p>
          </div>
          <ImagesGallery />
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-overline">Reviews</span>
            <h2 className="section-title mt-2 mb-3">
              What Our <span className="text-gradient-forest">Travelers Say</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Real stories from real travelers who explored with us.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ===== FAQ + NEWSLETTER ===== */}
      <section className="py-20 px-5 lg:px-8 bg-forest-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-overline">FAQ</span>
            <h2 className="section-title mt-2 mb-3">
              Frequently Asked <span className="text-gradient-forest">Questions</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <FaqList />
            </div>
            <div className="lg:col-span-2">
              <Newsletter />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;