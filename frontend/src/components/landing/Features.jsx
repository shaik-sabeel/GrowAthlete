import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Icons (using simple SVG or fa-icons if available, or just emojis/text for now to be safe)
// Importing from react-icons if available based on previous file analysis (Home.jsx used FaMapMarkerAlt)
import { FaUserCircle, FaUsers, FaTrophy, FaNewspaper, FaComments, FaChartLine } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-card-hover border border-gray-100 transition-all duration-300 group"
        >
            <div className="bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-gray-600 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            <div className="mt-4 text-brand-orange font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                Learn more <span>&rarr;</span>
            </div>
        </motion.div>
    );
};

const Features = () => {
    const features = [
        {
            icon: <FaUserCircle />,
            title: "Professional Athlete Profile",
            description: "Build a credible digital resume with verified stats, achievements, and highlights. Scouts can understand you in 30 seconds."
        },
        {
            icon: <FaUsers />,
            title: "Connect & Grow Network",
            description: "Seamlessly connect with coaches, scouts, agents, and industry leaders to expand your professional sporting connections."
        },
        {
            icon: <FaTrophy />,
            title: "Discover Tournaments",
            description: "Find and register for relevant tournaments, training programs, and competitions tailored to your sport and skill level."
        },
        {
            icon: <FaNewspaper />,
            title: "Sports News Feed",
            description: "Stay updated with the latest sports news, trending stories, and important announcements from the sports world."
        },
        {
            icon: <FaComments />,
            title: "Live Chat Rooms",
            description: "Join community rooms for training coordination, tactical discussions, and mentorship from experienced players."
        },
        {
            icon: <FaChartLine />,
            title: "Personal Dashboard",
            description: "Track your profile views, followers, resume completion, and messages from interested coaches."
        }
    ];

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How GrowAthlete <span className="text-brand-orange">Elevates Your Career</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                        Everything you need to build your professional sports presence, connect with opportunities, and grow your athletic career.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
