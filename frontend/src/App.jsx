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
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'; // ADDED Link here

// --- GLOBAL COMPONENTS (from src/components/ as per your structure) ---
import Navbar from './components/Navbar'; // Assuming this is your global header
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Splash from "./components/Splash";
import ErrorBoundary from './components/ErrorBoundary.jsx';

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
import ContactPage from './pages/ConatactPage.jsx';
import SportsResume from './pages/SportsResume.jsx';
import ResumeTemplate from './pages/ResumeTemplate.jsx'; // Import your Resume Template page
import MembershipPage from './pages/MembershipPage';
import EventsPage from './pages/EventsPage'; // Import the new Events page
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage'; // Import the Admin Create Event page
// --- GLOBAL STYLES (from src/ and src/pages_css/ as per your structure) ---
import './App.css'; // Main App global styles, container, etc.
import './index.css'; // Base HTML resets, font imports etc.
import './pages_css/variables.css'; // Global CSS variables
import CommunityPage from './pages/CommunityPage';
import CreateBlog from './pages/CreateBlogPost.jsx';
import Sponsorship from './pages/SponsorShip.jsx';
import SportsPage from './pages/SportsPage.jsx';

// Swiper styles (global for carousels)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; // Just in case, as some swiper modules use it
import Profile from './pages/Profile';

import SportsBlogPage from './pages/SportsBlogPage.jsx';     // <--- NEW IMPORT
import SingleBlogPostPage from './pages/SingleBlogPostPage.jsx'; // <--- NEW IMPORT
import NewsPage_SportsPulse from './pages/NewsPage_SportsPulse.jsx';  // <--- NEWS PAGE (full, original dummy data)
import LiveScoresPage from './pages/LiveScoresPage.jsx';              // <--- LIVE SCORES PAGE (full, original dummy data)
import SavedArticlesPage from './pages/SavedArticlesPage.jsx';        // <--- SAVED ARTICLES PAGE
// Wrapper component to handle conditional navbar rendering
function AppContent() {
  const location = useLocation();
  
  // Check authentication and user role
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user).role;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Don't show navbar on admin dashboard
  const showNavbar = !location.pathname.includes('/admin-dashboard');

  return (
    <>
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/about" element={<AboutPage />} />
          {/* <Route path="/athletes" element={<AthletesPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update" element={<Profile/>} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sports-resume" element={<SportsResume />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/explore-all-sports" element={<SportsPage />} />
          {/* Route for viewing events */}
          <Route path="/sports-blog" element={<SportsBlogPage />} />          {/* <--- NEW ROUTE */}
          <Route path="/sports-blog/:slug" element={<SingleBlogPostPage />} /> {/* <--- NEW ROUTE */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/sponsorships" element={<Sponsorship />} />

          <Route path="/news" element={<ErrorBoundary><NewsPage_SportsPulse /></ErrorBoundary>} />                   {/* <--- NEWS PAGE (full) */}
          <Route path="/live-scores" element={<ErrorBoundary><LiveScoresPage /></ErrorBoundary>} />               {/* <--- LIVE SCORES PAGE (full) */}
          <Route path="/saved-articles" element={<ErrorBoundary><SavedArticlesPage /></ErrorBoundary>} />         {/* <--- SAVED ARTICLES PAGE */}
            

          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
 main

<Route path="/splash" element={<Splash nextPath="/" />} />
<Route path="/resume-template" element={<ResumeTemplate />} />   


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
            path="/event/create"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/athletes/:id"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <MyProfile />
               </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin" isAllowed={isAuthenticated() && getUserRole() === 'admin'}>
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
              <ProtectedRoute isAllowed={isAuthenticated()}>
                <NewsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute role="athlete" isAllowed={isAuthenticated()}>
                <ContactPage />
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
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}



export default App;