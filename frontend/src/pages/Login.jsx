  // import React, { useState } from "react";
  // import api from "../utils/api";
  // import { useNavigate, Link } from "react-router-dom";
  // import "../pages_css/Login.css"; // <-- Import CSS
  // // import backgroundImage from "../assets/images/auditorium.383Z.png";
  // const Login = () => {
  //   const [formData, setFormData] = useState({
  //     email: "",
  //     password: "",
  //   });
  //   const navigate = useNavigate();

  //   const handleChange = (e) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       await api.post("/auth/login", formData);
  //       // Redirect to splash page after successful login
  //       navigate("/splash");
  //     } catch (err) {
  //       console.error(err);
  //       alert("Login failed");
  //     }
  //   };

  //   return (
  //     <div className="login-container">
  //       {/* <img src={backgroundImage} className="background-image" alt="" /> */}

  //       <form className="login-form" onSubmit={handleSubmit}>
  //         <h2>Welcome Back</h2>
  //         <hr />
  //         <div className="form-group">
  //           <label htmlFor="email">Email</label>
  //           <input
  //             type="email"
  //             name="email"
  //             onChange={handleChange}
  //             placeholder="Your email"
  //             required
  //           />
  //         </div>

  //         <div className="form-group">
  //           <label htmlFor="password">Password</label>
  //           <input
  //             name="password"
  //             type="password"
  //             onChange={handleChange}
  //             placeholder="Your password"
  //             required
  //           />
  //         </div>

  //         <p className="register-link">
  //           Don’t have an account? <Link to="/register">Sign Up</Link>
  //         </p>

  //         <button type="submit" className="login-btn">
  //           Login
  //         </button>
  //       </form>
  //     </div>
  //   );
  // };

  // export default Login;


  // src/components/Login.jsx (or wherever your Login.jsx is)
import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/Login_bg.jpg"
import Navbar from "../components/Navbar"; // Import Navbar component
import { useNotification } from "../context/NotificationContext";
// import "../pages_css/Login.css"; // REMOVE THIS LINE

const Login = () => {
  const [formData, setFormData] = useState({
    email: "", // User Name in UI maps to email
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
      
      // Store user data and JWT token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Show success message
      showSuccess(`Welcome back, ${user.username}!`);
      
      // Redirect based on user role
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/splash");
        }
      }, 1000);
      
    } catch (err) {
      console.error(err);
      
      // Handle specific error messages
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
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-black bg-opacity-30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl animate-fade-in-up" style={{opacity:"0.8"}}>
        {/* Left 'Welcome!' Section */}
        <div className="flex-1 p-8 md:p-12 text-white flex flex-col justify-center items-center lg:items-start text-center lg:text-left animate-slide-in-left">
          {/* Logo placeholder - replace with an actual SVG/image if desired */}
          {/* <div className="flex mb-6 text-white text-3xl font-bold">
            <span className="bg-white h-5 w-5 block mr-1"></span>
            <span className="bg-white h-5 w-5 block"></span>
          </div> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4" style={{color:"white"}}>
            Welcome!
          </h1>
          <div className="w-20 h-1 bg-white mb-6 rounded"></div>{" "}
          {/* Underline */}
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Welcome back! Let's pick up right where you left off.!!
          </p>
          <Link
            to="/register" // Adjust this path as needed
            className="px-8 py-3 rounded-full text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-md" style={{color:"white"}}
          >
            Don’t have an account?{" "}
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Right 'Sign in' Form Section */}
        <div className="flex-1 p-8 md:p-12 bg-black bg-opacity-20 flex flex-col justify-center items-center rounded-xl lg:rounded-l-none animate-slide-in-right">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 sm:mb-8 text-white text-center" style={{color:"white"}}>
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                User Name
              </label>
              <input
                type="email" // Changed from text to email
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="TechTree"
                required
                className="w-full p-4 rounded-md bg-white/28 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="********"
                required
                className="w-full p-4 rounded-md bg-white/28 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full p-4 mt-6 rounded-md text-white font-semibold transition-all duration-300 shadow-lg transform hover:scale-[1.01] ${
                isLoggingIn
                  ? 'bg-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
              }`}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mt-8">
            <a href="#" className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity">
              <i className="fab fa-facebook-f"></i>{" "}
              {/* Requires FontAwesome, or use SVG/emoji */}
            </a>
            <a href="#" className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity">
              <i className="fab fa-pinterest-p"></i>
            </a>
          </div>
          {/* You might need to add FontAwesome to your project or replace these with svgs/emojis for the icons to show up */}


          {/* Already have an account link is usually for Register,
              but keeping similar structure as original request, though slightly less visible to match source image*/}
          {/* <p className="text-center text-white/70 text-sm mt-8">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-orange-300 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
