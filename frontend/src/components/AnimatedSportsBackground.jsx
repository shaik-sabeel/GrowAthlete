import React, { useEffect, useRef } from 'react';
import './AnimatedSportsBackground.css';

const AnimatedSportsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const PARTICLE_COUNT = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    const particles = [];
    const mouse = { x: -1000, y: -1000 };
    let scrollY = window.scrollY || 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(randomY = false) {
        this.x = Math.random() * canvas.width;
        this.y = randomY ? Math.random() * canvas.height : -10;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = 0.2 + Math.random() * 0.6;
        this.size = 0.8 + Math.random() * 1.8; // 0.8 - 2.6 px
        this.alpha = 0.15 + Math.random() * 0.25; // 0.15 - 0.4
        this.hue = 210 + Math.random() * 60; // cool tones
      }
      step() {
        // parallax with scroll
        const parallax = (scrollY - (window.scrollY || 0)) * 0.002;
        this.x += this.vx + parallax;
        this.y += this.vy;

        // repel from mouse
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 12000) {
          const force = 12000 / Math.max(dist2, 100) * 0.0006;
          this.vx += dx * force;
          this.vy += dy * force;
        }

        // recycle
        if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = -10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // small glow trail
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha * 0.35})`;
        ctx.arc(this.x - this.vx * 2, this.y - this.vy * 2, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.step();
        p.draw();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="sports-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="sports-bg__canvas" />
      <div className="sports-bg__layer">
        <span className="ball ball--football"></span>
        <span className="ball ball--basketball"></span>
        <span className="ball ball--tennis"></span>
        <span className="ball ball--volleyball"></span>
        <span className="trophy"></span>
        <span className="medal"></span>
        <span className="stopwatch"></span>
        <span className="dumbbell"></span>
        <span className="jersey"></span>
        <span className="cone"></span>
      </div>
      <div className="sports-bg__layer sports-bg__layer--slow">
        <span className="ball ball--small"></span>
        <span className="ball ball--tiny"></span>
        <span className="whistle"></span>
        <span className="runner"></span>
      </div>
    </div>
  );
};

export default AnimatedSportsBackground;


