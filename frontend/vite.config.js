import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
 theme: {
    extend: {
      // backgroundImage: {
      //   'gradient-primary-button': 'linear-gradient(90deg, #ff8a00, #e23b6b)', // Orange to Red for buttons
      //   'gradient-blue-purple': 'linear-gradient(90deg, #6B46E4, #E940A8)', // For previous design's buttons, if needed elsewhere
      // },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.7s ease-out 0.2s forwards',
        'slide-in-left': 'slide-in-left 0.7s ease-out 0.2s forwards',
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});