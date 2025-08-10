// src/components/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Styles are managed globally in App.css, so no .css import here

const Button = ({ children, variant = 'primary', link, onClick }) => {
  const classes = `btn btn-${variant}`; // Uses classes defined in App.css

  // Framer Motion props for interaction
  const motionProps = {
    whileHover: { scale: 1.05, boxShadow: '0 8px 15px rgba(0,0,0,0.2)' },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  };

  if (link) {
    return (
      <Link to={link} className={classes}>
        <motion.span {...motionProps}>{children}</motion.span>
      </Link>
    );
  }

  return (
    <motion.button className={classes} onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
};

export default Button;