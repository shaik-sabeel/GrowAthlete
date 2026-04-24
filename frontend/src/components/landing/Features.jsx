import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaUsers, FaTrophy, FaNewspaper, FaComments, FaChartLine } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay }}
            className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-orange-200 hover:shadow-[0_20px_40px_rgba(255,107,0,0.12)] transition-all duration-300 group transform hover:-translate-y-2"
        >
            <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-orange-500 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-400 group-hover:text-white transition-all duration-300 mb-6 shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
            <div className="mt-5 text-orange-500 font-bold text-sm flex items-center gap-1 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
                Learn more <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
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
        <section className="py-16 md:py-24 bg-white relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-orange-100/50 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        How GrowAthlete <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Elevates Your Career</span>
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg font-medium">
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
