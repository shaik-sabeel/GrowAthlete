import React, { useState } from "react";
import axios from "axios";
import api from "../utils/api";
import '../pages_css/contact.css';
import Navbar from "../components/Navbar";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await api.post("/contact", formData);

      if (res.status === 200) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left Section: Contact Info */}
          <div className="space-y-8 lg:pt-10 animate-fade-in-left">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 drop-shadow-sm">
                Let's Chat.
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                Whether you have questions about our services, need support, or just want to verify your profile, our team is here to help you grow.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: "✉️",
                  title: "Email Us",
                  content: "growathlete8@gmail.com",
                  link: "mailto:growathlete8@gmail.com",
                  color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
                },
                {
                  icon: "📞",
                  title: "Call Us",
                  content: "+91 8500767368",
                  link: "tel:+918500767368",
                  color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
                },
                {
                  icon: "📍",
                  title: "Visit Us",
                  content: "Hyderabad, Telangana",
                  link: null,
                  color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-5 group p-4 rounded-2xl transition-colors hover:bg-gray-800/50">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    {item.link ? (
                      <a href={item.link} className="text-gray-400 hover:text-purple-400 transition-colors font-medium">
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-400 font-medium">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof / Trust Badge (Optional) */}
            <div className="pt-8 border-t border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500`}>
                      User
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400"><span className="text-white font-bold">500+</span> athletes joined this week.</p>
              </div>
            </div>
          </div>

          {/* Right Section: Form */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl animate-fade-in-up md:mt-0 mt-8 relative group">
            {/* Glow effect borders */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <h3 className="text-2xl font-bold text-white mb-8">Send us a message</h3>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-400 ml-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-400 ml-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-400 ml-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-y shadow-inner"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all duration-300 hover:-translate-y-1 
                  ${status === "success"
                    ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-500/50"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-900/30"}
                  ${status === "submitting" ? "opacity-75 cursor-wait" : ""}`}
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : status === "success" ? (
                  "Message Sent! ✅"
                ) : (
                  "Send Message 🚀"
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactPage;
