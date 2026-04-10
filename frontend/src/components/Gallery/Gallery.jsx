import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiX, FiMaximize2, FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";

const ImagesGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const { apiData: toursData, loading, error } = useFetch(`${BASE_URL}/tour`);

  // Max 8 images for the Bento Grid layout to look perfect
  const Images = toursData?.slice(0, 8).map(tour => ({
    src: tour.photo,
    alt: tour.title,
    location: tour.city
  })) || [];

  /* 
   * Bento Grid logic:
   * lg (4 cols):
   * Row 1 & 2: [0 0 1 2] 
   *            [0 0 3 3]
   * Row 3 & 4: [4 5 6 6]
   *            [7 7 6 6]
   */
  const getGridClass = (index) => {
    switch(index) {
      case 0: return "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2";
      case 1: return "col-span-1 md:col-span-1 lg:col-span-1 row-span-1 lg:row-span-1";
      case 2: return "col-span-1 md:col-span-1 lg:col-span-1 row-span-1 lg:row-span-1";
      case 3: return "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-1";
      case 4: return "col-span-1 md:col-span-1 lg:col-span-1 row-span-1 lg:row-span-1";
      case 5: return "col-span-1 md:col-span-1 lg:col-span-1 row-span-1 lg:row-span-1";
      case 6: return "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2";
      case 7: return "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-1";
      default: return "col-span-1";
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const openModal = (index) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-3 border-forest-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || Images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No gallery images available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[250px] lg:auto-rows-[300px]">
        {Images.map((item, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-[2rem] cursor-pointer bg-forest-100 ${getGridClass(index)}`}
            onClick={() => openModal(index)}
            onMouseEnter={() => setHoveredImage(index)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <img
              src={item.src}
              alt={item.alt}
              className={`w-full h-full object-cover transition-all duration-[800ms] ease-out ${
                hoveredImage === index ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Dynamic Interactive Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent transition-opacity duration-500 ${
              hoveredImage === index ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end h-full">
                <div className={`transition-all duration-500 transform ${
                  hoveredImage === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <p className="text-white text-h4 font-bold tracking-tight mb-2">
                    {item.alt}
                  </p>
                  <p className="text-forest-200 text-body-md flex items-center font-medium">
                    <FiMapPin className="text-cta mr-2 shrink-0" />
                    {item.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Expand icon in center */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-all duration-500 z-10 ${
              hoveredImage === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <FiMaximize2 className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Image Modal */}
      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50 outline-none"
        overlayClassName="fixed inset-0 bg-forest-900/98 backdrop-blur-2xl z-40"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        {selectedImage !== null && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
            {/* Standard Header Actions */}
            <div className="absolute top-6 right-6 lg:right-10 z-50 flex gap-4">
              <button
                onClick={closeModal}
                className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-forest-900 text-white transition-all duration-300"
                aria-label="Close"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Display Image Area */}
            <div className="relative w-full max-w-7xl flex-1 flex items-center justify-center select-none">
              <img
                src={Images[selectedImage].src}
                alt={Images[selectedImage].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-fade-in"
              />

              {/* Minimal Caption */}
              <div className="absolute bottom-6 sm:-bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-forest-900/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full text-white">
                <span className="font-semibold">{Images[selectedImage].alt}</span>
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                <span className="text-forest-300 flex items-center">
                  <FiMapPin className="mr-1.5 text-cta" />
                  {Images[selectedImage].location}
                </span>
              </div>
            </div>

            {/* Navigation Left / Right Controls */}
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage(selectedImage - 1)}
                className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-forest-900 text-white transition-all duration-300 group"
                aria-label="Previous"
              >
                <FiChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
            
            {selectedImage < Images.length - 1 && (
              <button
                onClick={() => setSelectedImage(selectedImage + 1)}
                className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-forest-900 text-white transition-all duration-300 group"
                aria-label="Next"
              >
                <FiChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            {/* Navigation Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {Images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    selectedImage === idx 
                      ? 'w-8 h-2 bg-cta' 
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ImagesGallery;