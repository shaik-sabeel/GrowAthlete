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

const Hero = () => {
    const heroContentRef = useRef(null);
    const heroImageRef = useRef(null);

    const images = [image1, image2, image3, image4];

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(heroContentRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }
        )
            .fromTo(heroImageRef.current,
                { opacity: 0, scale: 0.9, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" },
                "-=0.4"
            );
    }, []);

    return (
        <section className="relative w-full min-h-[90vh] flex items-center bg-white overflow-hidden pt-24 pb-12 lg:py-0">
            {/* Background elements for bright theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-orange-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-400/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/80"></div>
                
                {/* Dotted pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
                {/* Left Content */}
                <div ref={heroContentRef} className="text-center lg:text-left space-y-8 order-2 lg:order-1">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-xs md:text-sm text-orange-600 font-bold mb-2 shadow-sm tracking-wide uppercase"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        India's #1 Sports Talent Platform
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold !text-slate-900 leading-tight tracking-tight drop-shadow-sm">
                        Empowering <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Young Athletes</span> <br className="hidden md:block" />
                        Across India
                    </h1>
                    
                    <p className="text-base md:text-lg !text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                        Create your professional sports profile, connect with coaches and scouts, discover tournaments, and take your athletic career to the next level.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                        <Link to="/Profile" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-orange-500/40">
                                Create Your Profile &rarr;
                            </button>
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 md:gap-12 border-t border-slate-100 lg:border-none mt-8 lg:mt-0">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">50K+</h3>
                            <p className="text-orange-500 text-xs md:text-sm font-bold uppercase tracking-wide">Athletes</p>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">1000+</h3>
                            <p className="text-orange-500 text-xs md:text-sm font-bold uppercase tracking-wide">Tournaments</p>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">500+</h3>
                            <p className="text-orange-500 text-xs md:text-sm font-bold uppercase tracking-wide">Scouts</p>
                        </div>
                    </div>
                </div>

                {/* Right Image - 3D Rotating Carousel */}
                <div ref={heroImageRef} className="relative order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center perspective-1000">
                    <div className="carousel-scene">
                        <div className="carousel-container">
                            {images.map((img, index) => {
                                const rotate = index * 90;
                                return (
                                    <div
                                        key={index}
                                        className="carousel-cell"
                                        style={{
                                            transform: `rotateY(${rotate}deg) translateZ(250px)`,
                                            backgroundColor: '#ffffff'
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Carousel ${index + 1}`}
                                            className="w-[280px] h-[380px] object-cover bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white select-none pointer-events-none"
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
