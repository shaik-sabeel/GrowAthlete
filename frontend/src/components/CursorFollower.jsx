import React, { useEffect, useState, useRef } from 'react';

const CursorFollower = () => {
    // We use refs for direct DOM manipulation for performance (avoiding React re-renders on every mousemove)
    const cursorRef = useRef(null);
    const ringRef = useRef(null);
    const requestRef = useRef(null);

    const mouse = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };

            // Update the main cursor immediately
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }

            if (!visible) setVisible(true);
        };

        const handleMouseLeave = () => setVisible(false);
        const handleMouseEnter = () => setVisible(true);

        // Animation loop for the lagging ring
        const animateRing = () => {
            // Linear interpolation (Lerp) for smooth following
            // 0.15 is the speed factor (lower = slower lag)
            ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
            ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
            }

            requestRef.current = requestAnimationFrame(animateRing);
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        // Start animation loop
        requestRef.current = requestAnimationFrame(animateRing);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            cancelAnimationFrame(requestRef.current);
        };
    }, [visible]);

    // If mobile, likely don't want a custom cursor as touch doesn't have "hover"
    // Simple check for touch capability or screen width can be added if needed.

    return (
        <>
            {/* Main small dot cursor */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#F97316', // Orange-500 (brand color)
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-100px, -100px)', // Initial off-screen
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    marginLeft: '-4px', // Center the div on the cursor point
                    marginTop: '-4px'
                }}
            />

            {/* Lagging Ring */}
            <div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    border: '1.5px solid rgba(249, 115, 22, 0.5)', // Orange-500 with opacity
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9998, // Behind the dot
                    transform: 'translate(-100px, -100px)', // Initial off-screen
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    marginLeft: '-16px', // Center ring (32/2)
                    marginTop: '-16px',
                    mixBlendMode: 'screen' // Looks cool on dark backgrounds
                }}
            />
        </>
    );
};

export default CursorFollower;
