import React, { useState } from 'react';
import background from '../assets/background.mp4';
import cricket from '../assets/cricket.png';
import football from '../assets/football.png';
import basketball from '../assets/basketball.png';
import swimming from '../assets/swimming.png';
import faraz from '../assets/Faraz.jpeg';
import sabeel from '../assets/SA.jpeg';
import mourya from '../assets/MO.jpeg';
import ikram from '../assets/IK.jpeg';
import vamshi from '../assets/VA.jpeg';
import hemanth from '../assets/HE.jpg';
import joshitha from '../assets/JO.jpg';
import { Link } from 'react-router-dom';

// import '../pages_css/AboutPage.css'; // Removed custom CSS
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaQuoteLeft } from 'react-icons/fa';
import { GiBullseye, GiPodium, GiTeamIdea } from 'react-icons/gi';

const AboutPage = () => {

  const sports = [
    { name: 'Cricket', imgUrl: cricket },
    { name: 'Football', imgUrl: football },
    { name: 'Basketball', imgUrl: basketball },
    { name: 'Swimming', imgUrl: swimming },
  ];

  const teamMembers = [
    { name: 'Ande Hemanth', role: 'Founder & CEO', img: hemanth, link: 'https://www.linkedin.com/in/ande-hemanth-884020283/', color: 'from-orange-500 to-red-500' },
    { name: 'Yalaga Joshitha', role: 'Co-Founder', img: joshitha, link: 'https://www.linkedin.com/in/yalaga-joshitha-612b62376/', color: 'from-purple-500 to-pink-500' },
    { name: 'Mohammad Sabeel S A', role: 'Web Developer', img: sabeel, link: 'https://www.linkedin.com/in/shaik-sabeel/', color: 'from-blue-500 to-cyan-500' },
    { name: 'Muhammed Ikram R', role: 'Web Developer', img: ikram, link: 'https://www.linkedin.com/in/muhammed-ikram-7b56202bb', color: 'from-green-500 to-teal-500' },
    { name: 'Mohammad Faraz K', role: 'Front-End Developer', img: faraz, link: 'https://www.linkedin.com/in/faraz-shaik-a906192bb/', color: 'from-yellow-500 to-orange-500' },
    { name: 'Mourya Ayyappa N', role: 'Web Developer', img: mourya, link: 'https://www.linkedin.com/in/mourya-ayyappa-485563330/', color: 'from-indigo-500 to-blue-500' },
    //{ name: 'Vamshi', role: 'Web Developer', img: vamshi, link: 'https://www.linkedin.com/in/saivamshi-webdev/', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <div className="relative bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-12 border border-gray-700 h-[60vh] sm:h-[70vh]">
          {/* Background Video */}
          <div className="absolute inset-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
              <source src={background} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg" style={{ color: "white" }}  >
              About <span className="text-orange-500">Us</span>
            </h1>
            <p className="max-w-3xl text-lg sm:text-xl text-gray-300 leading-relaxed drop-shadow-md">
              Empowering the next generation of sports talent across India. We bridge the gap between aspiring talent and professional opportunities.
            </p>
          </div>
        </div>

        {/* MISSION / VISION / STORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Mission */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GiBullseye className="text-9xl text-orange-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <GiBullseye className="text-4xl text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                To nurture and elevate young sports talents in India by providing them with the visibility, resources, and support necessary to achieve their dreams.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GiPodium className="text-9xl text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <GiPodium className="text-4xl text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                To establish India as a global powerhouse of sports by enabling grassroots development and fostering a culture of excellence in athletics.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GiTeamIdea className="text-9xl text-purple-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <GiTeamIdea className="text-4xl text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
              <p className="text-gray-400 leading-relaxed">
                Born from a recognition of immense but often unnoticed talent, our founders created a platform to bridge the gap for emerging sports stars.
              </p>
            </div>
          </div>
        </div>

        {/* FEATURED SPORTS */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <span className="w-12 h-1 bg-orange-500 rounded-full"></span>
            Featured Sports
            <span className="w-12 h-1 bg-orange-500 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
              <div key={sport.name} className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500 z-10"></div>
                <img
                  src={sport.imgUrl}
                  alt={sport.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
                  <h3 className="text-2xl font-bold text-white translate-y-2 group-hover:translate-y-0 transition duration-300">
                    {sport.name}
                  </h3>
                  <div className="h-1 w-0 bg-orange-500 group-hover:w-full transition-all duration-300 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="bg-gray-800 rounded-3xl p-8 sm:p-12 border border-gray-700 shadow-2xl mb-16">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Excellence', desc: "We strive for excellence in functionalities and opportunities.", color: "text-yellow-400" },
              { title: 'Inclusivity', desc: "Accessible sports opportunities for everyone.", color: "text-green-400" },
              { title: 'Integrity', desc: "Honesty and transparency in all interactions.", color: "text-blue-400" },
              { title: 'Innovation', desc: "Continuously innovating tools for athletes.", color: "text-pink-400" }
            ].map((value, idx) => (
              <div key={idx} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition duration-300">
                <h3 className={`text-xl font-bold mb-3 ${value.color}`}>{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM SECTION - REIMAGINED */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet The Team</h2>

          {/* Tree/Hierarchical Visualization implied by grid layout and distinct styling for founders */}
          <div className="flex flex-col items-center gap-12">

            {/* Founders Level */}
            <div className="flex flex-wrap justify-center gap-12">
              {teamMembers.slice(0, 2).map((member) => (
                <div key={member.name} className="flex flex-col items-center group">
                  <div className="relative mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${member.color} rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500`}></div>
                    <img
                      src={member.img}
                      alt={member.name}
                      className="relative w-40 h-40 rounded-full object-cover border-4 border-gray-900 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-2 border border-gray-700 text-xl shadow-lg">
                      👑
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-3">{member.role}</p>
                  <a href={member.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">
                    <FaLinkedin size={20} />
                  </a>
                </div>
              ))}
            </div>

            {/* Connector Line (Visual only) */}
            <div className="hidden md:block w-px h-12 bg-gray-700"></div>

            {/* Developers Level */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {teamMembers.slice(2).map((member) => (
                <div key={member.name} className="flex flex-col items-center group">
                  <div className="relative mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${member.color} rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500`}></div>
                    <img
                      src={member.img}
                      alt={member.name}
                      className="relative w-28 h-28 rounded-full object-cover border-4 border-gray-900 shadow-md group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 text-center">{member.name}</h3>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{member.role}</p>
                  <a href={member.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition">
                    <FaLinkedin size={18} />
                  </a>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
