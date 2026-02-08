// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// --- GLOBAL COMPONENTS (from src/components/ as per your structure) ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Splash from "./components/Splash";
import ErrorBoundary from './components/ErrorBoundary.jsx';
import usePageTracking from './hooks/usePageTracking'; // Google Analytics 4 page tracking
import useAdminGA from './hooks/useAdminGA'; // GA4 for admin-only tracking
import ScrollToTop from "./components/ScrollToTop";
import { NotificationProvider } from './context/NotificationContext';

// --- PAGE COMPONENTS (from src/pages/ as per your structure) ---
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import AthletesPage from './pages/AthletesPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import MyProfile from './pages/MyProfile';
import NewsPage from './pages/NewsPage.jsx';
import ContactPage from './pages/ConatactPage.jsx';
// import Header from './components/Header'; // <-- The header for tournament page. Do NOT uncomment unless replacing global Navbar.
import TournamentsPage from './pages/TournamentsPage'; // <<<--- ADD THIS IMPORT
import SportsResume from './pages/SportsResume.jsx';
import ResumeTemplate from './pages/ResumeTemplate.jsx';
import MembershipPage from './pages/MembershipPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import CommunityPage from './pages/CommunityPage';
import CreateBlog from './pages/CreateBlogPost.jsx';
import Sponsorship from './pages/SponsorShip.jsx';
import SportsPage from './pages/SportsPage.jsx';
import Profile from './pages/Profile';
import SportsBlogPage from './pages/SportsBlogPage.jsx';
import SingleBlogPostPage from './pages/SingleBlogPostPage.jsx';
import NewsPage_SportsPulse from './pages/NewsPage_SportsPulse.jsx';
import LiveScoresPage from './pages/LiveScoresPage.jsx';
import SavedArticlesPage from './pages/SavedArticlesPage.jsx';
import CreateTournamentPage from './pages/CreateTournamentPage'; // Import the new page

// --- GLOBAL STYLES ---
import './App.css';
import './index.css';
import './pages_css/variables.css';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function AppContent() {
  const location = useLocation();
  usePageTracking();

  // Admin-only GA: load GA script and track only on admin routes or when user is admin
  // NOTE: Replace 'G-XXXXXXXXXX' with your real GA4 Measurement ID or source it from env
  // Prevents tracking in development via the hook's internal check
  // Determine admin-ness from role or current path
  // (kept local here to avoid duplicating logic across components)

  // Check authentication and user role
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (user) { try { return JSON.parse(user).role; } catch (e) { return null; } }
    return null;
  };

  const showNavbar = !location.pathname.includes('/admin-dashboard');

  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.includes('/admin-dashboard');
  useAdminGA('G-FPCM7YR90D', {
    enabled: isAdmin || isAdminRoute,
    adminPathPrefixes: ['/admin', '/admin-dashboard'],
  });

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="flex-grow" style={{ paddingTop: showNavbar ? '5rem' : '0' }}> {/* Added padding to account for fixed navbar */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update" element={<Profile />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sports-resume" element={<SportsResume />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/explore-all-sports" element={<SportsPage />} />

          {/* Add the route for TournamentsPage here */}
          <Route path="/tournaments" element={<TournamentsPage />} /> {/* <<<--- ADD THIS ROUTE */}

          <Route path="/sports-blog" element={<SportsBlogPage />} />
          <Route path="/sports-blog/:slug" element={<SingleBlogPostPage />} />
          <Route path="/sponsorships" element={<Sponsorship />} />
          <Route path="/news" element={<ErrorBoundary><NewsPage_SportsPulse /></ErrorBoundary>} />
          <Route path="/live-scores" element={<ErrorBoundary><LiveScoresPage /></ErrorBoundary>} />
          <Route path="/saved-articles" element={<ErrorBoundary><SavedArticlesPage /></ErrorBoundary>} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
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
            path="/tournaments/create"
            element={
              <ProtectedRoute role="admin" isAllowed={isAuthenticated() && getUserRole() === 'admin'}>
                <CreateTournamentPage />
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
            path="/contact" // Assuming contact can also be protected
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
              <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Go to Homepage</Link>
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
    <NotificationProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}

export default App;