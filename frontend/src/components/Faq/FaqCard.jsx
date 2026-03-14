import React, { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'

const FaqCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0); // Open first FAQ by default

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div 
      className={`group relative bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg ${
        isOpen ? 'shadow-md border-BaseColor/20' : ''
      }`}
    >
      {/* Gradient border on hover - using BaseColor */}
      <div className="absolute inset-0 bg-gradient-to-r from-BaseColor to-BHoverColor opacity-0 group-hover:opacity-5 transition-opacity rounded-xl pointer-events-none"></div>
      
      {/* Question Header */}
      <button
        onClick={toggleOpen}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-BaseColor/20 rounded-xl relative z-10"
      >
        <div className="flex items-start sm:items-center space-x-3 flex-1">
          {/* Question number - using BaseColor */}
          <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-BaseColor text-white flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            isOpen ? 'scale-110 shadow-md' : ''
          }`}>
            {index + 1}
          </span>
          
          {/* Question text */}
          <h4 className={`text-sm sm:text-base lg:text-lg font-semibold transition-colors duration-300 pr-4 ${
            isOpen ? 'text-BaseColor' : 'text-gray-800'
          }`}>
            {item.question}
          </h4>
        </div>

        {/* Toggle icon with animation - using BaseColor */}
        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-BaseColor text-white rotate-180' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
        }`}>
          {isOpen ? <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" /> : <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />}
        </div>
      </button>

      {/* Answer with conditional rendering instead of CSS animation */}
      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 pl-[3.5rem] sm:pl-[4.5rem] animate-fadeIn">
          <div className="relative">
            {/* Decorative line - using BaseColor */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-BaseColor to-BHoverColor rounded-full"></div>
            
            {/* Answer text */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-4">
              {item.content}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FaqCard