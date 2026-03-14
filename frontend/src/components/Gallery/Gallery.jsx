import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Modal from "react-modal";
import { FiX, FiMaximize2, FiHeart } from "react-icons/fi";
import Img01 from "../../assets/images/hero-img01.jpg";
import Img02 from "../../assets/images/hero-img02.jpg";
import Img03 from "../../assets/images/front-02.jpg";
import Img04 from "../../assets/images/gallery-04.jpg";
import Img06 from "../../assets/images/gallery-03.jpg";
import Img07 from "../../assets/images/gallery-08.jpg";
import Img08 from "../../assets/images/gallery-02.jpg";
import Img09 from "../../assets/images/gallery-01.jpg";

const ImagesGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [likedImages, setLikedImages] = useState({});

  const Images = [
    { src: Img01, alt: "Mountain landscape", location: "Swiss Alps" },
    { src: Img02, alt: "Beach sunset", location: "Maldives" },
    { src: Img03, alt: "City skyline", location: "New York" },
    { src: Img06, alt: "Tropical beach", location: "Bali" },
    { src: Img04, alt: "Historic temple", location: "Kyoto" },
    { src: Img07, alt: "Desert safari", location: "Dubai" },
    { src: Img08, alt: "European street", location: "Paris" },
    { src: Img09, alt: "Mountain lake", location: "Canada" },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    Modal.setAppElement('#root');

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const openModal = (index) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const toggleLike = (index, e) => {
    e.stopPropagation();
    setLikedImages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="relative">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 768: 2, 992: 3, 1200: 4 }}>
        <Masonry gutter="1.5rem">
          {Images.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => openModal(index)}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-lg font-semibold">{item.alt}</p>
                  <p className="text-white/70 text-sm">{item.location}</p>
                </div>
              </div>

              {/* Like button */}
              <button
                onClick={(e) => toggleLike(index, e)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 hover:shadow-xl"
              >
                <FiHeart 
                  className={`w-5 h-5 transition-colors ${
                    likedImages[index] ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} 
                />
              </button>

              {/* Expand button */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                <FiMaximize2 className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {/* Modal for fullscreen view */}
      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-xl z-40"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        {selectedImage !== null && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            >
              <FiX className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Image container */}
            <div className="relative max-w-7xl max-h-[90vh]">
              <img
                src={Images[selectedImage].src}
                alt={Images[selectedImage].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
              
              {/* Image info */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/50 backdrop-blur-md rounded-2xl p-4 text-white">
                <h3 className="text-xl font-semibold">{Images[selectedImage].alt}</h3>
                <p className="text-white/70">{Images[selectedImage].location}</p>
              </div>
            </div>

            {/* Navigation arrows */}
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage(selectedImage - 1)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {selectedImage < Images.length - 1 && (
              <button
                onClick={() => setSelectedImage(selectedImage + 1)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ImagesGallery;