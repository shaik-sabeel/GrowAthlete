import React, { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "../pages_css/Register.css"; 

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
      // Redirect to splash page after signup
      navigate("/splash");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create your Account</h2>

        <div className="form-group">
          <label htmlFor="username">Full Name</label>
          <input
            name="username"
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
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
            placeholder="Create a password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">I am...</label>
          <select name="role" onChange={handleChange}>
            <option value="athlete">Athlete</option>
            <option value="coach">Coach</option>
            <option value="scout">Scout</option>
            <option value="sponsor">Sponsor</option>
          </select>
        </div>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <button type="submit" className="register-btn">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
