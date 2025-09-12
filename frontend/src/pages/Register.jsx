// import React, { useState } from "react";
// import api from "../utils/api";
// import { Link, useNavigate } from "react-router-dom";
// import "../pages_css/Register.css"; 

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "athlete",
//   });

//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/auth/register", formData);
//       alert("Registered successfully!");
//       // Redirect to splash page after signup
//       // navigate("/splash");
//       navigate("/update");
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed");
//     }
//   };

//   return (
//     <div className="register-container">
//       <form className="register-form" onSubmit={handleSubmit}>
//         <h2>Create your Account</h2>

//         <div className="form-group">
//           <label htmlFor="username">Full Name</label>
//           <input
//             name="username"
//             onChange={handleChange}
//             placeholder="Your full name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             name="email"
//             type="email"
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
//             placeholder="Create a password"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="role">I am...</label>
//           <select name="role" onChange={handleChange}>
//             <option value="athlete">Athlete</option>
//             <option value="coach">Coach</option>
//             <option value="scout">Scout</option>
//             <option value="sponsor">Sponsor</option>
//           </select>
//         </div>

//         <p className="login-link">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>

//         <button type="submit" className="register-btn">
//           Create Account
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;


// src/components/Register.jsx (or wherever your Register.jsx is)
import React, { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import bg from '../assets/Login_bg.jpg'
import Navbar from "../components/Navbar";
// import "../pages_css/Register.css"; // REMOVE THIS LINE

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "athlete",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Registered successfully!");
      // navigate("/splash"); // Keeping existing redirect behavior
      navigate("/update");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-2 sm:p-4 md:p-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-col lg:flex-row w-full   max-w-4xl bg-black bg-opacity-30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl animate-fade-in-up" style={{opacity:"0.8"}}>
        {/* Left 'Welcome!' Section - Reused for consistency */}
        <div className="flex-1 p-8 md:p-12 text-white flex flex-col justify-center items-center lg:items-start text-center lg:text-left animate-slide-in-left" >
          {/* Logo placeholder - replace with an actual SVG/image if desired */}
          {/* <div className="flex mb-6 text-white text-3xl font-bold">
            <span className="bg-white h-5 w-5 block mr-1"></span>
            <span className="bg-white h-5 w-5 block"></span>
          </div> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white" style={{color:"white"}}>
            Join Us! {/* Changed for signup context */}
          </h1>
          <div className="w-20 h-1 bg-white mb-6 rounded"></div>{" "}
          {/* Underline */}
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Create your account and start your fitness journey with us today!
          </p>
          <Link
            to="/login" // Adjust this path as needed
            className="px-8 py-3 rounded-full text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-md" style={{color:"white"}}
          >
            Have an account? Login
          </Link>
        </div>

        {/* Right 'Create your Account' Form Section */}
        <div className="flex-1 p-8 md:p-12 bg-black bg-opacity-50 flex flex-col justify-center items-center rounded-xl lg:rounded-l-none animate-slide-in-right">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 sm:mb-8 text-white text-center" style={{color:"white"}}>
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-white text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full p-4 rounded-md bg-white/28 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Your email"
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
                placeholder="Create a password"
                required
                className="w-full p-4 rounded-md bg-white/28 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-white text-sm font-medium mb-2"
              >
                I am...
              </label>
              <select
                id="role"
                name="role"
                onChange={handleChange}
                className="w-full p-4 rounded-md bg-white/28 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200 appearance-none bg-no-repeat bg-right-center pr-10" // added appearance-none and pr for custom arrow
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3e%3c/path%3e%3c/svg%3e")`,
                  backgroundSize: '1.25rem', // Match common tailwind sizes for spacing
                  backgroundPosition: 'right 1rem center' // Position arrow icon
                }}
              >
                <option value="athlete" className="bg-gray-800 text-white">Athlete</option>
                <option value="athlete" className="bg-gray-800 text-white">Coach</option>
                <option value="athlete" className="bg-gray-800 text-white">Scout</option>
                <option value="athlete" className="bg-gray-800 text-white">Sponsor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full p-4 mt-6 rounded-md text-white font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg transform hover:scale-[1.01]"
            >
              Create Account
            </button>
          </form>

          {/* Social Icons - Reused for consistency */}
          <div className="flex justify-center space-x-6 mt-8">
            <a href="#" className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity">
              <i className="fab fa-pinterest-p"></i>
            </a>
          </div>

          {/* <p className="text-center text-white/70 text-sm mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-300 hover:underline font-medium"
            >
              Login
            </Link>
          </p> */}
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
