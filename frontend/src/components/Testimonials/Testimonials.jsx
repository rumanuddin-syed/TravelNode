import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";

import avatar1 from "../../assets/images/ava-1.jpg";
import avatar2 from "../../assets/images/ava-2.jpg";
import avatar3 from "../../assets/images/ava-3.jpg";

const Testimonials = () => {
  const { apiData, loading, error } = useFetch(`${BASE_URL}/review?starred=true`);

  // Purely dynamic data from the database
  const displayData = apiData || [];

  const settings = {
    dots: true,
    infinite: displayData.length > 1,
    speed: 800,
    slidesToShow: Math.min(3, displayData.length),
    slidesToScroll: 1,
    autoplay: displayData.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(2, displayData.length) } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-10 h-10 border-3 border-forest-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div className="text-center py-10 bg-forest-50/50 rounded-[2rem] border border-dashed border-forest-200">
        <FiMessageCircle className="w-8 h-8 text-forest-300 mx-auto mb-3" />
        <p className="text-body-sm text-forest-400 font-medium italic">Our travelers are currently writing their stories...</p>
      </div>
    );
  }

  return (
    <div className="relative testimonial-slider">
      <Slider {...settings}>
        {displayData.map((rev, idx) => (
          <div key={rev._id} className="px-3">
            <div className="card p-6 h-full">
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center mb-4">
                <FiMessageCircle className="w-5 h-5 text-accent" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(rev.rating) ? "text-warning" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-body-sm text-text-secondary leading-relaxed mb-6 line-clamp-4">
                "{rev.reviewText}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                <img
                  src={[avatar1, avatar2, avatar3][idx % 3]}
                  alt={rev.username}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-forest-100"
                />
                <div>
                  <h5 className="text-body-sm font-semibold text-text-primary line-clamp-1">
                    {rev.username}
                  </h5>
                  <p className="text-caption text-text-muted line-clamp-1">
                    {rev.productId?.title || rev.tourId?.title || "Verified Traveler"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;