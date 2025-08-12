import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import "../pages_css/Login.css"; // <-- Import CSS
// import backgroundImage from "../assets/images/auditorium.383Z.png";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", formData);
      // Redirect to splash page after successful login
      navigate("/splash");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* <img src={backgroundImage} className="background-image" alt="" /> */}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <hr />
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Your password"
            required
          />
        </div>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
