import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ quote, author, role, sport, location }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full"
        >
            <div>
                <div className="text-gray-200 text-4xl mb-4">
                    <FaQuoteLeft />
                </div>
                <p className="text-gray-600 italic mb-6">"{quote}"</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold text-sm">
                    {author.charAt(0)}{author.split(' ')[1]?.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{author}</h4>
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
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Athletes Love <span className="text-brand-orange">GrowAthlete</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
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
