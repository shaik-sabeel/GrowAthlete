
import React, { useEffect, useState } from 'react';

const CursorFollower = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updateCursorPosition = (e) => {
            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });
                setVisible(true);
            });
        };

        const handleMouseLeave = () => setVisible(false);
        const handleMouseEnter = () => setVisible(true);

        window.addEventListener('mousemove', updateCursorPosition);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
                backdropFilter: 'blur(1px)', // Slight blur for effect
                pointerEvents: 'none', // Ignore mouse events so it doesn't block clicking
                transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
                zIndex: 9999,
                transition: 'transform 0.05s linear', // Smooth movement
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
            }}
        />
    );
};

export default CursorFollower;
