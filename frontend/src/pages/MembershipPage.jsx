import React from 'react';
import MembershipCard from '../components/MemberShipCard'; // Adjust path if components are in a different sub-folder
import Navbar from '../components/Navbar';
import '../pages_css/variables.css'


const MembershipPage = () => {
  const membershipLevels = [
    {
      level: 'Free Tier',
      price: '₹0',
      description: 'Access to basic features and public content.',
      features: [
        'Athlete Profiles',
        'Networking',
        'Sessions',
        'Tournaments',
        // 'Content' (Excluded based on image checks being implied by existing original logic or just list all?)
        // Original logic was just list of strings. I will list all features but maybe note inclusions? 
        // Original MembershipCard component just prints the list. 
        // I will list the included features.
        'Content'
      ],
      buttonText: 'Get Started',
      color: 'primary', // Light green for free tier
      borderColor: 'border-green-500',
      textColor: 'text-green-800'
    },
    {
      level: 'Premium Gold',
      price: '₹99',
      description: 'Unlock enhanced features for serious athletes.',
      features: [
        '100+ Profiles',
        'Jobs in Sports',
        'Open to All Sessions',
        'Open to All Sessions'
      ],
      buttonText: 'Go Premium Gold',
      color: 'primary', // Light blue for standard tier
      borderColor: 'border-blue-500',
      textColor: 'text-yellow-200'
    },
    {
      level: 'Academy Pro',
      price: '₹999',
      description: 'The ultimate package for networking and opportunities.',
      features: [
        '1,000+ Network Access',
        'Creation 8 pvt Sports',
        'Brand Endorsements',
        'Priority Tournament reg',
        'Sponsorship Tools',
        'Attendance add-on option'
      ],
      buttonText: 'Go Academy Pro',
      color: 'primary', // Light purple for premium tier
      borderColor: 'border-purple-500',
      textColor: 'text-purple-800'
    },
  ];

  return (


    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="text-center mb-12 py-20">
        <h1 className="text-5xl font-extrabold leading-tight mb-4" style={{ color: "#049c9e" }}>
          Choose Your Membership
        </h1>
        <p className="text-xl text-white max-w-2xl mx-auto">
          Unlock exclusive features and enhance your sports journey with our flexible membership options.
        </p>
      </div>

      <div className="Membership grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {membershipLevels.map((level, index) => (
          <MembershipCard
            key={index}
            level={level.level}
            price={level.price}
            description={level.description}
            features={level.features}
            buttonText={level.buttonText}
            bgColor={level.color}
            borderColor={level.borderColor}
            textColor={level.textColor}
          />
        ))}
      </div>
    </div>
  );
};

export default MembershipPage;