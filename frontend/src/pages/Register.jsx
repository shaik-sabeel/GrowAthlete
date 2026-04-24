import React, { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import bg from '../assets/Login_bg.jpg'
import Navbar from "../components/Navbar";
import { useNotification } from "../context/NotificationContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "athlete",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post("/auth/register", formData);
      
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        showSuccess("Account created successfully! Welcome to GrowAthlete!");
        setTimeout(() => {
          navigate("/update");
        }, 1500);
      } else {
        showError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.field === 'password') {
          showError(`Password Error: ${errorData.message}`);
          if (errorData.errors && errorData.errors.length > 0) {
            showWarning(`Requirements: ${errorData.errors.join(', ')}`);
          }
        } else if (errorData.field === 'email') {
          showError(`Email Error: ${errorData.message}`);
        } else {
          showError(errorData.message || "Registration failed");
        }
      } else {
        showError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-2 sm:p-4 md:p-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 animate-fade-in-up mt-16">
        
        {/* Left 'Join Us!' Section */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-gradient-to-br from-orange-50 to-white/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-slate-900 tracking-tight">
            Join Us!
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-400 mb-8 rounded-full"></div>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-md font-medium">
            Create your account and start your fitness journey with us today!
          </p>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl text-orange-600 font-bold bg-white border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Have an account? Login
          </Link>
        </div>

        {/* Right 'Create your Account' Form Section */}
        <div className="flex-1 p-8 md:p-10 bg-white/60 flex flex-col justify-center items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-slate-900 text-center tracking-tight">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Your email"
                required
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wide">
                I am...
              </label>
              <select
                id="role"
                name="role"
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 shadow-sm appearance-none pr-10 font-medium cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748B'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3e%3c/path%3e%3c/svg%3e")`,
                  backgroundSize: '1.25rem',
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
                <option value="scout">Scout</option>
                <option value="sponsor">Sponsor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-4 mt-6 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 hover:shadow-orange-500/30'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
