// src/components/ImageCarousel.jsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../utils/api';

const AUTOPLAY_MS = 3500;

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/admin/public/ads');
        const list = res.data || [];
        setItems(list);
        
        // Helper function to construct proper image URLs
        const getImageUrl = (url) => {
          // If URL is already a full URL (starts with http), return as is
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          }
          // Otherwise, prepend the base URL
          const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com';
          return `${baseURL}${url}`;
        };
        
        setImages(list.map(a => getImageUrl(a.image)));
      } catch (e) {
        setItems([]);
        setImages([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!images.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center shadow-md" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(6px)' }}>
      {images.length > 0 ? (
        items[index]?.linkUrl ? (
          <a href={items[index].linkUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full">
            <img
              src={images[index]}
              alt={items[index]?.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </a>
        ) : (
          <img
            src={images[index]}
            alt={items[index]?.title || `Slide ${index + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/80">
          No ads yet
        </div>
      )}

      <button onClick={goPrev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full cursor-pointer hover:bg-opacity-100 transition duration-150 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={goNext} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-3 rounded-full cursor-pointer hover:bg-opacity-100 transition duration-150 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full cursor-pointer ${i === index ? 'bg-white' : 'bg-white/50'}`}></span>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;