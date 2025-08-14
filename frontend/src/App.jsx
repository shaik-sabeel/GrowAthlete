// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Register from "./pages/Register";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       <Route path="/register" element={<Register />} />

//         <Route path="/login" element={<Login />} />
//         {/* <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         /> */}

        

//         <Route
//           path="/athlete/dashboard"
//           element={
//             <ProtectedRoute role="athlete">
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import AboutPage from "./pages/AboutPage"; // 1. IMPORT YOUR NEW PAGE HERE

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Existing Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />

//         {/* 👇 2. ADD THE ROUTE FOR YOUR ABOUT PAGE HERE 👇 */}
//         <Route path="/about" element={<AboutPage />} />

//         {/* Your Protected Routes */}
//         {/* 
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         /> 
//         */}

//         <Route
//           path="/athlete/dashboard"
//           element={
//             <ProtectedRoute role="athlete">
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // ADDED Link here

// --- GLOBAL COMPONENTS (from src/components/ as per your structure) ---
import Navbar from './components/Navbar'; // Assuming this is your global header
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Splash from "./components/Splash";

// --- PAGE COMPONENTS (from src/pages/ as per your structure) ---
import Home from './pages/Home'; // Your main homepage
import AboutPage from './pages/AboutPage';
import AthletesPage from './pages/AthletesPage'; // Your Athletes Page
import Login from './pages/Login'; // Your Login Page
import Register from './pages/Register'; // Your Register Page
import AdminDashboard from './pages/AdminDashboard'; // Placeholder
import UserDashboard from './pages/UserDashboard'; // Placeholder
import MyProfile from './pages/MyProfile'; // Placeholder for user profile page
import NewsPage from './pages/NewsPage.jsx';
// --- GLOBAL STYLES (from src/ and src/pages_css/ as per your structure) ---
import './App.css'; // Main App global styles, container, etc.
import './index.css'; // Base HTML resets, font imports etc.
import './pages_css/variables.css'; // Global CSS variables

// Swiper styles (global for carousels)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; // Just in case, as some swiper modules use it
import Profile from './pages/Profile';

import SportsBlogPage from './pages/SportsBlogPage.jsx';     // <--- NEW IMPORT
import SingleBlogPostPage from './pages/SingleBlogPostPage.jsx'; // <--- NEW IMPORT
function App() {
  // A very basic authentication simulation for ProtectedRoute
  const isAuthenticated = () => {
    // In a real app, this would check JWT, user context, etc.
    return localStorage.getItem('token') !== null;
  };

  return (
    // <Router>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      <Navbar /> This is your global site header
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          {/* <Route path="/athletes" element={<AthletesPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update" element={<Profile/>} />
          <Route path="/sports-blog" element={<SportsBlogPage />} />          {/* <--- NEW ROUTE */}
            <Route path="/sports-blog/:slug" element={<SingleBlogPostPage />} /> {/* <--- NEW ROUTE */}
            

<Route path="/splash" element={<Splash nextPath="/" />} />


          {/* --- PROTECTED ROUTES --- */}


        <Route
            path="/profile"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin" isAllowed={isAuthenticated()}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/athlete/dashboard"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/athletes"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <AthletesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sports-news"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <NewsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={
            <div style={{ padding: '80px 20px', minHeight: '80vh', textAlign: 'center', paddingTop: '150px' }}>
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary" style={{marginTop: '20px'}}>Go to Homepage</Link>
            </div>
          } />

        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;