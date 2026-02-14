import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaFileAlt, FaSearch, FaRocket } from 'react-icons/fa';

const StepCard = ({ number, icon, title, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative z-10"
        >
            <div className="absolute -top-4 bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-orange-500" style={{ color: "black" }} >
                {number}
            </div>

            <div className="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-gray-700 mb-6 mt-4">
                {icon}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
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
        <section className="py-12 md:py-20 bg-gray-50 relative overflow-hidden">
            {/* Background decorative line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 hidden lg:block transform -translate-y-1/2"></div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <div className="inline-block px-4 py-1 bg-gray-200 rounded-full text-xs font-semibold text-gray-600 mb-4">
                        How It Works
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Start Your Journey in <span className="text-sky-700">4 Simple Steps</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                        Getting started on GrowAthlete is quick and easy. Create your profile today and start getting noticed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
