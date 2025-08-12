// src/components/Splash.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages_css/Splash.css"; // create your styles here\
import intro from '../assets/growathlete_intro.mp4'; // Path to your intro video

const Splash = ({ nextPath = "/" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(nextPath);
    }, 5000); // 5 sec video

    return () => clearTimeout(timer);
  }, [navigate, nextPath]);

  return (
    <div className="splash-container">
      <video
        className="splash-video"
        src={intro}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default Splash;
