import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faGooglePlusG,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import {
  faArrowUpRightFromSquare,
  faSyncAlt,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';

// Define the characters for "COMING SOON"
const coming = "COMING";
const soon = "SOON";

const SponsorShip = () => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Add the class after a short delay to trigger the initial animation on mount
    const timer = setTimeout(() => {
      setAnimationClass('animate-text-flicker');
    }, 100); // Small delay to ensure DOM is ready and CSS can transition

    // Clear interval on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white p-4 overflow-hidden rounded-xl"
      style={{
        backgroundImage: 'url("https://via.placeholder.com/1920x1080/000000?text=Forest+Road")', // Replace with your image URL
      }}
    >
      {/* Overlay to darken image slightly for text readability */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between">
        {/* Left Section: Animated Coming Soon Message */}
        <div className="flex-1 text-center md:text-left p-4 md:pl-0 mb-8 md:mb-0">
          <div className="text-6xl md:text-8xl font-bold tracking-wider leading-tight">
            {coming.split('').map((char, index) => (
              <span key={`coming-${index}`}
                    className={`inline-block opacity-0 ${animationClass} delay-${index * 150}`}
                    style={{animationDelay: `${index * 0.15}s`}}
              >
                {char}
              </span>
            ))}
            <br />
            {soon.split('').map((char, index) => (
              <span key={`soon-${index}`}
                    className={`inline-block opacity-0 ${animationClass} delay-${(coming.length + index) * 150}`}
                    style={{animationDelay: `${(coming.length + index) * 0.15}s`}}
              >
                {char}
              </span>
            ))}
          </div>

          {/* <button className="mt-8 px-8 py-3 bg-gray-600 bg-opacity-70 rounded-full hover:bg-opacity-90 transition duration-300 text-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mr-2" /> Visit site
          </button> */}
        </div>

        {/* Right Section: Lorem Ipsum, Subscribe, Socials */}
        <div className="flex-1 bg-gradient-to-l from-black via-transparent to-transparent bg-opacity-30 p-8 rounded-lg md:ml-8 md:p-12">
          <p className="text-lg mb-8 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore. Quisquie velit nisi, pretium.
          </p>

          <p className="text-xl font-semibold mb-4">Subscribe and get updates</p>
          <div className="flex items-center mb-8">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-grow p-3 rounded-l-md border border-gray-400 bg-gray-800 bg-opacity-70 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 rounded-r-md hover:bg-blue-700 transition duration-300 uppercase text-sm font-semibold">
              Subscribe
            </button>
          </div>

          {/* Social Icons */}
          {/* <div className="flex space-x-4">
            <a
              href="#"
              className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full text-white hover:bg-white hover:text-black transition duration-300"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a
              href="#"
              className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full text-white hover:bg-white hover:text-black transition duration-300"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a
              href="#"
              className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full text-white hover:bg-white hover:text-black transition duration-300"
              aria-label="Google Plus"
            >
              <FontAwesomeIcon icon={faGooglePlusG} size="lg" />
            </a>
            <a
              href="#"
              className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full text-white hover:bg-white hover:text-black transition duration-300"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div> */}
        </div>
      </div>

      {/* Fixed action buttons */}
        {/* <div className="fixed right-6 bottom-6 flex flex-col space-y-4 z-20">
            <button
            className="w-14 h-14 bg-gray-700 bg-opacity-70 rounded-full flex items-center justify-center text-white text-xl hover:bg-opacity-90 transition duration-300"
            aria-label="Toggle Fullscreen"
            >
            <FontAwesomeIcon icon={faExpand} />
            </button>
            <button
            className="w-14 h-14 bg-gray-700 bg-opacity-70 rounded-full flex items-center justify-center text-white text-xl hover:bg-opacity-90 transition duration-300"
            aria-label="Refresh"
            >
            <FontAwesomeIcon icon={faSyncAlt} />
            </button>
        </div> */}
    </div>
  );
};

export default SponsorShip;