// // src/pages/MembershipPage.jsx
import React from 'react';
import MembershipCard from '../components/MembershipCard.jsx'; // Adjust path if components are in a different sub-folder
import Navbar from '../components/Navbar';
import '../pages_css/variables.css'


const MembershipPage = () => {
  const membershipLevels = [
    {
      level: 'Free',
      price: '$0',
      description: 'Access to basic features and public content.',
      features: [
        'View public sports profiles',
        'Read community blog posts',
        'Receive newsletter',
        'Basic support',
        'Read Events'
      ],
      buttonText: 'Get Started - Free',
      color: 'primary', // Light green for free tier
      borderColor: 'border-green-500',
      textColor: 'text-green-800'
    },
    {
      level: 'Standard',
      price: '$1',
      description: 'Unlock enhanced features for serious athletes.',
      features: [
        'All Free features',
        'Create your sports profile',
        'Connect with other athletes',
        'Upload images & videos',
        'Priority support'
      ],
      buttonText: 'Choose Standard',
      color: 'primary', // Light blue for standard tier
      borderColor: 'border-blue-500',
      textColor: 'text-yellow-200'
    },
    {
      level: 'Premium',
      price: '$2',
      description: 'The ultimate package for networking and opportunities.',
      features: [
        'All Standard features',
        'Access premium job board',
        'Get featured on homepage',
        'Early access to new features',
        'Dedicated account manager'
      ],
      buttonText: 'Go Premium',
      color: 'primary', // Light purple for premium tier
      borderColor: 'border-purple-500',
      textColor: 'text-purple-800'
    },
  ];

  return (
    

    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <Navbar />
      <div className="text-center mb-12 py-20">
        <h1 className="text-5xl font-extrabold leading-tight mb-4" style={{color : "#049c9e"}}>
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



// src/pages/MembershipPage.jsx
// import React from 'react';
// import MembershipCard from '../components/MembershipCard';
// import Navbar from '../components/Navbar';
// import '../pages_css/HomePage.css'; // Import HomePage styles for consistency

// const MembershipPage = () => {
//   const membershipLevels = [
//     {
//       level: 'Free',
//       price: '$0',
//       description: 'Access to basic features and public content.',
//       features: [
//         'View public sports profiles',
//         'Read community blog posts',
//         'Receive newsletter',
//         'Basic support'
//       ],
//       buttonText: 'Get Started - Free',
//       color: 'bg-green-100',
//       borderColor: 'border-green-500',
//       textColor: 'text-green-800'
//     },
//     {
//       level: 'Standard',
//       price: '$3',
//       description: 'Unlock enhanced features for serious athletes.',
//       features: [
//         'All Free features',
//         'Create your sports profile',
//         'Connect with other athletes',
//         'Upload images & videos',
//         'Priority support'
//       ],
//       buttonText: 'Choose Standard',
//       color: 'bg-blue-100',
//       borderColor: 'border-blue-500',
//       textColor: 'text-blue-800'
//     },
//     {
//       level: 'Premium',
//       price: '$5',
//       description: 'The ultimate package for professional networking and opportunities.',
//       features: [
//         'All Standard features',
//         'Access premium job board',
//         'Get featured on homepage',
//         'Early access to new features',
//         'Dedicated account manager'
//       ],
//       buttonText: 'Go Premium',
//       color: 'bg-purple-100',
//       borderColor: 'border-purple-500',
//       textColor: 'text-purple-800'
//     },
//   ];

//   return (
//     <div>
//       <Navbar />
//       <section className="hp-platform-features-section">
//         <div className="section-header-common">
//           <h1 className="section-heading">Choose Your Membership</h1>
//           <p className="section-description">
//             Unlock exclusive features and enhance your sports journey with our flexible membership options.
//           </p>
//         </div>
//         <div className="hp-platform-features-grid" style={{marginBottom: "5rem"}}>
//           {membershipLevels.map((level, index) => (
//             <MembershipCard
//               key={index}
//               level={level.level}
//               price={level.price}
//               description={level.description}
//               features={level.features}
//               buttonText={level.buttonText}
//               bgColor={level.color}
//               borderColor={level.borderColor}
//               textColor={level.textColor}
//             />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MembershipPage;