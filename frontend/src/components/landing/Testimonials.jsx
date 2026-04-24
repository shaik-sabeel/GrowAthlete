import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ quote, author, role, sport, location }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col justify-between h-full transition-all duration-300 hover:border-orange-200 hover:shadow-[0_20px_40px_rgba(255,107,0,0.12)]"
        >
            <div>
                <div className="text-orange-200 text-4xl mb-5 opacity-70 group-hover:text-orange-400 transition-colors">
                    <FaQuoteLeft />
                </div>
                <p className="text-slate-600 italic mb-8 leading-relaxed font-medium">"{quote}"</p>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-50 pt-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-md animate-float" style={{animationDelay: `${Math.random()}s`}}>
                    {author.charAt(0)}{author.split(' ')[1]?.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-base">{author}</h4>
                    <p className="text-sm text-slate-500 font-medium">{role} • {location}</p>
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
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Athletes Love <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">GrowAthlete</span>
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg font-medium">
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
