import React from 'react';
import Marquee from "react-fast-marquee";

const TrustedBy = () => {
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
        <section className="bg-white py-12 border-b border-slate-100 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

            <div className="container mx-auto px-4 text-center">
                <h4 className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-8 opacity-90">
                    Trusted by Top Organizations and Brands
                </h4>

                <Marquee pauseOnHover={true} speed={50} gradient={false}>
                    <div className="flex items-center gap-16 pr-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                        {organizations.map((org, index) => (
                            <h3 key={index} className="text-xl md:text-2xl font-bold text-slate-400 hover:text-orange-500 transition-colors duration-300 cursor-default whitespace-nowrap">
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
