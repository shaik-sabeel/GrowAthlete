import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ quote, author, role, sport, location }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between h-full transition-all duration-300 hover:border-orange-500/30 hover:shadow-orange-900/20"
        >
            <div>
                <div className="text-gray-600 text-4xl mb-4 opacity-50">
                    <FaQuoteLeft />
                </div>
                <p className="!text-gray-300 italic mb-6 leading-relaxed">"{quote}"</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {author.charAt(0)}{author.split(' ')[1]?.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{author}</h4>
                    <p className="text-xs text-gray-500">{role} • {location}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Testimonials = () => {
    const testimonials = [
        {
            quote: "GrowAthlete helped me connect with coaches I never would have found otherwise. Within 3 months, I got selected for state-level training!",
            author: "Priya Singh",
            role: "Badminton Player",
            location: "Delhi"
        },
        {
            quote: "The platform is exactly what young athletes in India need. My profile views increased by 500% and I received multiple trial offers.",
            author: "Arjun Patel",
            role: "Football Striker",
            location: "Mumbai"
        },
        {
            quote: "Finding tournaments used to be so difficult. Now I can see all upcoming events in one place and register directly. Game changer!",
            author: "Sneha Reddy",
            role: "Athletics",
            location: "Hyderabad"
        }
    ];

    return (
        <section className="py-12 md:py-20 bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Athletes Love <span className="text-orange-500">GrowAthlete</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Hear from athletes who have transformed their careers using our platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
