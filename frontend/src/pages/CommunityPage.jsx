// src/pages/CommunityPage.jsx

import React from 'react';
// import Sidebar from '../components/Sidebar'; // Removed as requested
import PostCreator from '../components/PostCreator';
import Post from '../components/Post'
import ImageCarousel from '../components/ImageCarousel';
import Navbar from '../components/Navbar';
const CommunityPage = () => {
  return (
    <>
      <Navbar />
    <div className="flex h-screen bg-gray-100 p-8 font-sans justify-center items-start"> {/* Align items to start of flex container */}
      {/* No Left Sidebar anymore */}

      {/* Middle Content Area - now taking up more space */}
      {/* w-2/3 will make it take approx 66% of the parent width, leaving 33% for the carousel */}
      <div className="w-2/3 flex flex-col space-y-8 mr-8"> {/* Added mr-8 for spacing */}
        <PostCreator />
         <Post />
        {/* Placeholder for the community feed (where posts would appear) */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
          <p className="text-gray-500">User posts will appear here...</p>
        </div> */}
      </div>

      {/* Right Image Carousel - now taking up one third of the space */}
      <div className="w-1/3 flex justify-center">
        <ImageCarousel />
      </div>
    </div>
    </>
  );
};

export default CommunityPage;
