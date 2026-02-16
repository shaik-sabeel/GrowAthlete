import React from 'react';
import Marquee from "react-fast-marquee";

const TrustedBy = () => {
    // Placeholder logos (text for now as per plan, or use simple standard icons/text)
    const organizations = [
        "Sports Authority of India",
        "BCCI",
        "Laccrose Federation",
        "Indian Football",
        "Athletics Federation",
        "ISL",
        "Hyderabad Pickle Ball Association",
        "Telangana Throw Federation"
    ];

    return (
        <section className="bg-gray-800/50 py-10 border-b border-gray-800">
            <div className="container mx-auto px-4 text-center">
                <h4 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-8 opacity-80">
                    Trusted by Top Organizations and Brands
                </h4>

                <Marquee pauseOnHover={true} speed={50} gradient={false}>
                    <div className="flex items-center gap-16 pr-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300 hover:opacity-100">
                        {organizations.map((org, index) => (
                            <h3 key={index} className="text-lg md:text-2xl font-bold text-gray-500 hover:text-gray-300 transition-colors cursor-default whitespace-nowrap">
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
