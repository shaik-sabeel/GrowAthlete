import React from 'react';
import Marquee from "react-fast-marquee"; // Assuming we might want to use this, or just CSS marquee.
// If react-fast-marquee is not installed, we can use a simple CSS animation or flex layout.
// For now, I'll use a standard flex layout as per the static design, or a simple CSS scroller if needed.

const TrustedBy = () => {
    // Placeholder logos (text for now as per plan, or use simple standard icons/text)
    const organizations = [
        "Sports Authority of India",
        "BCCI",
        "Hockey India",
        "Indian Football",
        "AIFF",
        "ISL",
        "Pro Kabaddi",
        "Khelo India"
    ];

    return (
        <section className="bg-gray-50 py-10 border-b border-gray-200">
            <div className="container mx-auto px-4 text-center">
                <h4 className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-8">
                    Trusted by Top Organizations and Brands
                </h4>

                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                    {organizations.map((org, index) => (
                        <h3 key={index} className="text-lg md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-default">
                            {org}
                        </h3>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
