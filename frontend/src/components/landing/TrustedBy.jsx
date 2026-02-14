import React from 'react';
import Marquee from "react-fast-marquee";

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

                <Marquee pauseOnHover={true} speed={50} gradient={false}>
                    <div className="flex items-center gap-16 pr-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                        {organizations.map((org, index) => (
                            <h3 key={index} className="text-lg md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-default whitespace-nowrap">
                                {org}
                            </h3>
                        ))}
                    </div>
                </Marquee>
            </div>
        </section>
    );
};

export default TrustedBy;
