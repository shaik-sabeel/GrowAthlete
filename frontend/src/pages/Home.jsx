// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Button from '../components/Button'; // Keeping for potential reuse or if Button is used in sub-components later
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 !text-white font-sans">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trusted By Section */}
      <TrustedBy />

      {/* 3. Features Section (Elevates Your Career) */}
      <Features />

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. Testimonials Section */}
      <Testimonials />

      {/* 6. Final CTA (Optional but good for conversion) */}
      <section className="py-12 md:py-20 bg-gray-900 text-white text-center relative overflow-hidden border-t border-gray-800">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-orange-600/20 rounded-full blur-3xl rotate-12"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-blue-600/10 rounded-full blur-3xl -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 tracking-tight text-white">Ready to start your journey?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto text-gray-300 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 font-medium shadow-xl">
            Join thousands of athletes who are taking their career to the next level with GrowAthlete.
          </p>
          <Link to="/Profile">
            <button className="bg-orange-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-orange-900/20 hover:shadow-orange-700/40 hover:bg-orange-700 transition-all transform hover:-translate-y-1 text-base border border-orange-500/50">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;