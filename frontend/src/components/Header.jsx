// // src/components/Header.jsx
// import React from 'react';
// import { Search } from 'lucide-react'; // Assuming you might have lucide-react or similar icon library

// const Header = () => {
//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex items-center justify-between">
//       {/* Logo */}
//       <div className="flex items-center space-x-2">
//         <img src="/growathlete_logo.png" alt="GrowAthlete Logo" className="h-8" />
//         <span className="text-xl font-bold text-gray-800 hidden sm:block">GrowAthlete</span>
//       </div>

//       {/* Navigation */}
//       <nav className="hidden lg:flex items-center space-x-8 text-gray-700 font-medium">
//         <a href="#" className="hover:text-indigo-600 transition-colors">Profile</a>
//         <a href="#" className="hover:text-indigo-600 transition-colors">Feed</a>
//         <a href="#" className="hover:text-indigo-600 transition-colors">News</a>
//         <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Tournaments</a>
//       </nav>

//       {/* Search & User */}
//       <div className="flex items-center space-x-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32 md:w-48 text-sm"
//           />
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//         </div>
//         <img
//           src="https://www.gravatar.com/avatar/2c7d99fe21aee1d52ef13faefcd0c57c?s=200&d=mp"
//           alt="User Avatar"
//           className="h-9 w-9 rounded-full border-2 border-gray-300 cursor-pointer"
//         />
//       </div>
//     </header>
//   );
// };

// export default Header;