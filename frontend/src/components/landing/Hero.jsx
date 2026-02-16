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
        <section className="relative w-full min-h-[90vh] flex items-center bg-gray-900 overflow-hidden pt-24 pb-12 lg:py-0">
            {/* Background blobs for subtle effect - adjusted for dark mode */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-orange-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-3xl"></div>
                {/* Add a subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 opacity-80"></div>
            </div>

            <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* Left Content */}
                <div ref={heroContentRef} className="text-center lg:text-left space-y-8 order-2 lg:order-1">
                    <div className="inline-block px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-xs md:text-sm text-orange-400 font-bold mb-2 shadow-lg tracking-wide uppercase">
                        India's #1 Sports Talent Platform
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold !text-white leading-tight tracking-tight drop-shadow-lg">
                        Empowering <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Young Athletes</span> <br className="hidden md:block" />
                        Across India
                    </h1>
                    <p className="text-base md:text-lg !text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Create your professional sports profile, connect with coaches and scouts, discover tournaments, and take your athletic career to the next level.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                        <Link to="/Profile" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-700/30 transition-all duration-300 transform hover:-translate-y-1">
                                Create Your Profile &rarr;
                            </button>
                        </Link>
                        {/* <Link to="/demo" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-gray-800 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-700">
                                <span>&#9654;</span> Watch Demo
                            </button>
                        </Link> */}
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 md:gap-12 border-t border-gray-800 lg:border-none mt-8 lg:mt-0">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white">50K+</h3>
                            <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wide">Athletes</p>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white">1000+</h3>
                            <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wide">Tournaments</p>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white">500+</h3>
                            <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wide">Scouts</p>
                        </div>
                    </div>
                </div>

                {/* Right Image - 3D Rotating Carousel */}
                <div ref={heroImageRef} className="relative order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center perspective-1000">
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
                                            backgroundColor: '#1f2937' // dark gray bg for cells
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Carousel ${index + 1}`}
                                            className="w-[280px] h-[380px] object-cover bg-gray-800 rounded-2xl shadow-2xl border-4 border-gray-700 select-none pointer-events-none"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default Hero;
