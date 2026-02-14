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
    <div className="home-page-container bg-white text-gray-900 font-sans">
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
      <section className="py-12 md:py-20 bg-brand-orange text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Ready to start your journey?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto text-black bg-orange-100 rounded-2xl p-4">
            Join thousands of athletes who are taking their career to the next level with GrowAthlete.
          </p>
          <Link to="/register">
            <button className="bg-white text-brand-orange font-bold py-3 px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all transform hover:-translate-y-1 text-sm md:text-base">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;