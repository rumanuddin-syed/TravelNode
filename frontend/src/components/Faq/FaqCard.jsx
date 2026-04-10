import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FaqCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className={`card overflow-hidden transition-all duration-300 ${isOpen ? 'border-accent/30 shadow-card-hover' : ''}`}>
      {/* Question */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-accent/20 rounded-2xl"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-caption font-bold transition-all duration-300 ${
            isOpen ? 'bg-primary text-white' : 'bg-forest-100 text-forest-700'
          }`}>
            {index + 1}
          </span>
          <h4 className={`text-body-sm sm:text-body-md font-semibold transition-colors duration-200 pr-4 ${
            isOpen ? 'text-primary' : 'text-text-primary'
          }`}>
            {item.question}
          </h4>
        </div>

        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-accent text-white' : 'bg-forest-50 text-forest-600 hover:bg-forest-100'
        }`}>
          {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
        </div>
      </button>

      {/* Answer */}
      {isOpen && (
        <div className="px-5 pb-5 pl-16 animate-fade-in">
          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-cta rounded-full" />
            <p className="text-body-sm text-text-secondary leading-relaxed">
              {item.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqCard;