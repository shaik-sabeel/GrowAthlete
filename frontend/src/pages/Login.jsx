import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/Login_bg.jpg";
import Navbar from "../components/Navbar"; 
import { useNotification } from "../context/NotificationContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "", 
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { user, token } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      showSuccess(`Welcome back, ${user.username}!`);

      setTimeout(() => {
        if (user.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/splash");
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const errorMessage = err.response.data;
        if (typeof errorMessage === 'string') {
          showError(errorMessage);
        } else {
          showError(errorMessage.message || "Login failed");
        }
      } else {
        showError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-2 sm:p-4 md:p-8"
        // Playing the original background image without an overlay so it is completely clear
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 animate-fade-in-up mt-16">
          
          {/* Left 'Welcome!' Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-gradient-to-br from-orange-50 to-white/50">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-slate-900 tracking-tight">
              Welcome!
            </h1>
            <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-400 mb-8 rounded-full"></div>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-md font-medium">
              Welcome back! Let's pick up right where you left off.
            </p>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-orange-600 font-bold bg-white border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Don’t have an account? Sign Up
            </Link>
          </div>

          {/* Right Login Form Section */}
          <div className="flex-1 p-8 md:p-12 bg-white/60 flex flex-col justify-center items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-slate-900 text-center tracking-tight">
              Login to Account
            </h2>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 sm:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex justify-between items-center text-sm mt-2">
                <label className="flex items-center text-slate-600 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded text-orange-500 focus:ring-orange-500 w-4 h-4" />
                  Remember me
                </label>
                <a href="#" className="font-semibold text-orange-500 hover:text-orange-600">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full p-4 mt-8 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                  isLoggingIn
                    ? 'bg-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 hover:shadow-orange-500/30'
                }`}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="flex justify-center space-x-6 mt-10">
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm">
                <i className="fab fa-facebook-f"></i>
              </span>
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm">
                <i className="fab fa-instagram"></i>
              </span>
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm">
                <i className="fab fa-pinterest-p"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
