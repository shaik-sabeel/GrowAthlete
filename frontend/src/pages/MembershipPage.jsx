// // src/pages/MembershipPage.jsx
// import React from 'react';
// import MembershipCard from '../components/MembershipCard'; // Adjust path if components are in a different sub-folder
// import Navbar from '../components/Navbar';

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
//       color: 'bg-green-100', // Light green for free tier
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
//       color: 'bg-blue-100', // Light blue for standard tier
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
//       color: 'bg-purple-100', // Light purple for premium tier
//       borderColor: 'border-purple-500',
//       textColor: 'text-purple-800'
//     },
//   ];

//   return (
    

//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
//         <Navbar />
//       <div className="text-center mb-12 py-20">
//         <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
//           Choose Your Membership
//         </h1>
//         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//           Unlock exclusive features and enhance your sports journey with our flexible membership options.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
//         {membershipLevels.map((level, index) => (
//           <MembershipCard
//             key={index}
//             level={level.level}
//             price={level.price}
//             description={level.description}
//             features={level.features}
//             buttonText={level.buttonText}
//             bgColor={level.color}
//             borderColor={level.borderColor}
//             textColor={level.textColor}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MembershipPage;

import React from 'react';
import MembershipCard from '../components/MembershipCard';
import Navbar from '../components/Navbar';
import axios from 'axios'; // Ensure you have axios installed: npm install axios

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
        'Basic support'
      ],
      buttonText: 'Get Started - Free',
      color: 'bg-green-100', // Light green for free tier
      borderColor: 'border-green-500',
      textColor: 'text-green-800'
    },
    {
      level: 'Standard',
      price: '$3',
      description: 'Unlock enhanced features for serious athletes.',
      features: [
        'All Free features',
        'Create your sports profile',
        'Connect with other athletes',
        'Upload images & videos',
        'Priority support'
      ],
      buttonText: 'Choose Standard',
      color: 'bg-blue-100', // Light blue for standard tier
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800'
    },
    {
      level: 'Premium',
      price: '$5',
      description: 'The ultimate package for professional networking and opportunities.',
      features: [
        'All Standard features',
        'Access premium job board',
        'Get featured on homepage',
        'Early access to new features',
        'Dedicated account manager'
      ],
      buttonText: 'Go Premium',
      color: 'bg-purple-100', // Light purple for premium tier
      borderColor: 'border-purple-500',
      textColor: 'text-purple-800'
    },
  ];

  // Function to handle clicking a membership card
  const handleChoosePlan = async (selectedLevel) => {
    // Retrieve the JWT token from where you store it (e.g., localStorage)
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please log in to select a membership plan.");
      // You can also redirect to the login page here
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:5000/api/memberships/update-level', 
        { level: selectedLevel }, // The request body with the selected level
        {
          headers: {
            'Authorization': `Bearer ${token}` // Secure the request with the user's token
          }
        }
      );
      
      console.log(response.data.message); // "Successfully updated membership to Standard"
      alert(`Your membership has been updated to ${selectedLevel}!`);
      
      // Optional: You could update the user state in your app or redirect them
      // window.location.href = '/profile';

    } catch (error) {
      console.error("Failed to update membership:", error);
      alert("There was an error updating your membership. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="text-center mb-12 py-20">
        {/* ...your h1 and p tags... */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {membershipLevels.map((plan, index) => (
          // Add an onClick handler to the wrapper div
          <div key={index} onClick={() => handleChoosePlan(plan.level)} style={{ cursor: 'pointer' }}>
            <MembershipCard
              level={plan.level}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              bgColor={plan.color}
              borderColor={plan.borderColor}
              textColor={plan.textColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPage;