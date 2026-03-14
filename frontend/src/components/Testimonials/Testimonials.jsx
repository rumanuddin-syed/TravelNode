import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import avatar1 from "../../assets/images/ava-1.jpg";
import avatar2 from "../../assets/images/ava-2.jpg";
import avatar3 from "../../assets/images/ava-3.jpg";

const Testimonials = () => {
  const testimonialsData = [
    {
      pic: avatar1,
      name: "John Doe",
      location: "New York, USA",
      rating: 5,
      description:
        "Our trip with TravelNode was nothing short of amazing! The attention to detail, friendly guides, and unforgettable experiences made it truly special. Can't wait for the next adventure!",
    },
    {
      pic: avatar2,
      name: "Jane Smith",
      location: "London, UK",
      rating: 5,
      description:
        "TravelNode exceeded my expectations. From landscapes to encounters, every moment was a delight. The team's expertise and personalized service made the journey unforgettable.",
    },
    {
      pic: avatar3,
      name: "Chris Johnson",
      location: "Sydney, Australia",
      rating: 5,
      description:
        "I've traveled with many agencies, but TravelNode stands out. The seamless planning, knowledgeable guides, and unique destinations set them apart. An incredible way to explore the world!",
    },
    {
      pic: avatar1,
      name: "Emily Davis",
      location: "Toronto, Canada",
      rating: 5,
      description:
        "TravelNode made our dream vacation a reality. The carefully crafted itinerary, diverse activities, and genuine hospitality created an experience we'll cherish forever. Highly recommended!",
    },
    {
      pic: avatar3,
      name: "Alex Turner",
      location: "Berlin, Germany",
      rating: 5,
      description:
        "A big shoutout to the TravelNode team for an unforgettable journey. The blend of adventure and relaxation was perfect. I'll be booking my next trip with them without a doubt.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Custom styles for dots on light background
  const dotStyles = `
    .testimonial-slider-light .slick-dots {
      bottom: -40px;
    }
    .testimonial-slider-light .slick-dots li {
      margin: 0 4px;
    }
    .testimonial-slider-light .slick-dots li button {
      width: 8px;
      height: 8px;
      padding: 0;
    }
    .testimonial-slider-light .slick-dots li button:before {
      width: 8px;
      height: 8px;
      color: #d1d5db;
      opacity: 1;
    }
    .testimonial-slider-light .slick-dots li.slick-active button:before {
      width: 20px;
      color: #B71C1C;
      opacity: 1;
    }
  `;

  return (
    <div className="relative">
      <style>{dotStyles}</style>
      <Slider {...settings} className="testimonial-slider-light">
        {testimonialsData.map((data, index) => (
          <div key={index} className="px-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Quote icon */}
              <div className="relative mb-6">
                <FaQuoteLeft className="w-8 h-8 text-BaseColor/20" />
              </div>

              {/* Rating stars */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < data.rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
                "{data.description}"
              </p>

              {/* Author info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor rounded-full blur-sm opacity-50"></div>
                  <img
                    src={data.pic}
                    alt={data.name}
                    className="relative w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div>
                  <h5 className="text-gray-900 font-semibold">{data.name}</h5>
                  <p className="text-gray-500 text-sm">{data.location}</p>
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