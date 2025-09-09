// src/components/MembershipCard.jsx
import React from 'react';

const MembershipCard = ({ level, price, description, features, buttonText, bgColor, borderColor, textColor }) => {
  return (
    <div className={`
      ${bgColor} 
      ${borderColor} 
      border-2 
      rounded-xl 
      shadow-lg 
      p-8 
      flex 
      flex-col 
      items-center 
      text-center 
      transition 
      duration-300 
      ease-in-out 
      hover:scale-105 
      hover:shadow-xl
    `}>
      <h2 className={`text-4xl font-bold ${textColor} mb-4`}>
        {level}
      </h2>
      <p className={`text-5xl font-extrabold text-gray-900 mb-6 ${textColor}`}>
        {price}<span className="text-2xl font-medium text-gray-400">/month</span>
      </p>
      <p className="text-white text-lg mb-6 leading-relaxed">
        {description}
      </p>

      <ul className="list-none space-y-3 mb-8 w-full">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-white text-md">
            <svg
              className={`w-5 h-5 mr-3 ${textColor}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className= {`
          ${textColor === 'text-green-800' ? 'bg-green-600 hover:bg-green-700' : ''}
          ${textColor === 'text-blue-800' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          ${textColor === 'text-purple-800' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          text-white 
          font-bold 
          py-3 
          px-8 
          rounded-full 
          shadow-lg 
          transition 
          duration-300 
          ease-in-out 
          transform 
          hover:-translate-y-1 
          focus:outline-none 
          focus:ring-4 
          focus:ring-opacity-75
          ${textColor === 'text-green-800' ? 'focus:ring-green-300' : ''}
          ${textColor === 'text-blue-800' ? 'focus:ring-blue-300' : ''}
          ${textColor === 'text-purple-800' ? 'focus:ring-purple-300' : ''}
        `}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MembershipCard;