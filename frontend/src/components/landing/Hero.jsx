import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Button from '../Button';

// Import images for carousel
import image1 from '../../assets/images/image_1.jpg';
import image2 from '../../assets/images/image_2.jpg';
import image3 from '../../assets/images/image_3.jpg';
import image4 from '../../assets/images/image_4.jpg';

// Placeholder image for hero (can be replaced with actual asset later)
// Using a random sports image from unsplash for now or a placeholder color block
const Hero = () => {
    const heroContentRef = useRef(null);
    const heroImageRef = useRef(null);

    // Carousel Images
    const images = [image1, image2, image3, image4];


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

                {/* Right Image - 3D Rotating Carousel */}
                <div ref={heroImageRef} className="relative order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center">
                    <div className="carousel-scene">
                        <div className="carousel-container">
                            {images.map((img, index) => {
                                // Calculate rotation for 4 items: 0, 90, 180, 270
                                const rotate = index * 90;
                                // Width ~300. tan(45) = 1. radius ~ 150. Let's make it larger for spacing.
                                return (
                                    <div
                                        key={index}
                                        className="carousel-cell"
                                        style={{
                                            transform: `rotateY(${rotate}deg) translateZ(250px)`,
                                            backgroundColor: 'white' // Ensure background is white for contain
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Carousel ${index + 1}`}
                                            className="w-[280px] h-[380px] object-contain bg-white rounded-2xl shadow-2xl border-4 border-white select-none pointer-events-none"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Floating Badge (Kept outside the spinner to stay visible) */}
                    <div className="absolute -bottom-10 -left-4 md:-bottom-2 md:-left-10 z-20">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="bg-white p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 md:gap-4 max-w-[200px] md:max-w-xs border border-gray-100"
                        >
                            {/* <div className="bg-orange-100 p-2 md:p-3 rounded-full text-brand-orange text-xl md:text-2xl">
                                🏆
                            </div>*/}
                            {/* <div>
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">Get Scouted</h4>
                                <p className="text-xs text-gray-500 leading-tight">By top coaches & academies</p>
                            </div>*/}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
