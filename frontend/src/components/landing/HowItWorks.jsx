import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaFileAlt, FaSearch, FaRocket } from 'react-icons/fa';

const StepCard = ({ number, icon, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center relative z-10 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,107,0,0.15)] hover:border-orange-200"
        >
            <div className="absolute -top-5 bg-gradient-to-br from-orange-500 to-orange-400 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base border-4 border-white text-white shadow-lg animate-float">
                {number}
            </div>

            <div className="bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl text-orange-500 mb-6 mt-4 shadow-inner transition-transform duration-300 transform hover:scale-110">
                {icon}
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
        </motion.div>
    );
};

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: <FaUserPlus />,
            title: "Create Your Profile",
            description: "Sign up and build your professional athlete profile with your stats, achievements, and highlights."
        },
        {
            number: "02",
            icon: <FaFileAlt />,
            title: "Showcase Your Talent",
            description: "Add videos, photos, and verified achievements. Generate a professional resume automatically."
        },
        {
            number: "03",
            icon: <FaSearch />,
            title: "Get Discovered",
            description: "Scouts, coaches, and academies can find you based on your sport, skills, and location."
        },
        {
            number: "04",
            icon: <FaRocket />,
            title: "Grow Your Career",
            description: "Connect with opportunities, register for tournaments, and take your athletic journey forward."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decorative line - Light theme */}
            <div className="absolute top-[60%] left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent -z-0 hidden lg:block transform -translate-y-1/2"></div>
            
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-5 py-1.5 bg-white border border-orange-100 shadow-sm rounded-full text-xs font-bold text-orange-500 mb-5 tracking-widest uppercase"
                    >
                        How It Works
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                    >
                        Start Your Journey in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">4 Simple Steps</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 text-base md:text-lg font-medium"
                    >
                        Getting started on GrowAthlete is quick and easy. Create your profile today and start getting noticed.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8">
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} delay={index * 0.15} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
