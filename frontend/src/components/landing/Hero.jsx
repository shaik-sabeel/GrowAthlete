import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Button from '../Button';

// Placeholder image for hero (can be replaced with actual asset later)
// Using a random sports image from unsplash for now or a placeholder color block
const Hero = () => {
    const heroContentRef = useRef(null);
    const heroImageRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(heroContentRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
        )
            .fromTo(heroImageRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
                "-=0.4"
            );
    }, []);

    return (
        <section className="relative w-full min-h-[90vh] flex items-center bg-white overflow-hidden pt-24 pb-12 lg:py-0">
            {/* Background blobs for subtle effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-brand-orange/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* Left Content */}
                <div ref={heroContentRef} className="text-center lg:text-left space-y-6 order-2 lg:order-1">
                    <div className="inline-block px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs md:text-sm text-gray-600 font-medium mb-2 shadow-sm">
                        India's #1 Sports Talent Platform
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                        Empowering <br className="hidden md:block" />
                        <span className="text-brand-orange">Young Athletes</span> <br className="hidden md:block" />
                        Across India
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Create your professional sports profile, connect with coaches and scouts, discover tournaments, and take your athletic career to the next level.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                        <Link to="/register" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                                Create Your Profile &rarr;
                            </button>
                        </Link>
                        <Link to="/demo" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-brand-orange text-gray-700 hover:text-brand-orange font-semibold py-3.5 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                                <span>&#9654;</span> Watch Demo
                            </button>
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 md:gap-12 border-t border-gray-100 lg:border-none mt-8 lg:mt-0">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">50K+</h3>
                            <p className="text-gray-500 text-xs md:text-sm">Athletes</p>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">1000+</h3>
                            <p className="text-gray-500 text-xs md:text-sm">Tournaments</p>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">500+</h3>
                            <p className="text-gray-500 text-xs md:text-sm">Scouts</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div ref={heroImageRef} className="relative order-1 lg:order-2 mb-8 lg:mb-0">
                    <div className="relative z-10 mx-auto max-w-md lg:max-w-full">
                        <div className="bg-gradient-to-tr from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl p-2 shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
                                alt="Athletes in action"
                                className="rounded-xl md:rounded-2xl w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute -bottom-6 -left-4 md:bottom-8 md:left-8 bg-white p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 md:gap-4 max-w-[200px] md:max-w-xs z-20 border border-gray-100"
                        >
                            <div className="bg-orange-100 p-2 md:p-3 rounded-full text-brand-orange text-xl md:text-2xl">
                                🏆
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">Get Scouted</h4>
                                <p className="text-xs text-gray-500 leading-tight">By top coaches & academies</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
