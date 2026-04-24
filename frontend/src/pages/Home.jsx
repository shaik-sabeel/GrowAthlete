// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
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

      {/* 6. Final CTA */}
      <section className="py-16 md:py-24 bg-white text-slate-900 text-center relative overflow-hidden border-t border-slate-100">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-orange-200/40 rounded-full blur-[100px] rotate-12"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-amber-100/40 rounded-full blur-[100px] -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">start your journey?</span>
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-600 bg-orange-50/80 backdrop-blur-md border border-orange-100 rounded-2xl p-8 font-medium shadow-sm">
            Join thousands of athletes who are taking their career to the next level with GrowAthlete.
          </p>
          <Link to="/Profile">
            <button className="bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold py-4 px-12 rounded-xl shadow-[0_10px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,107,0,0.3)] hover:from-orange-600 hover:to-orange-500 transition-all duration-300 transform hover:-translate-y-1 text-lg">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;