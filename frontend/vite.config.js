import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'bouncy-fade-in': {
            '0%': { opacity: '0', transform: 'translateY(-20px) rotate(-10deg)' },
            '60%': { opacity: '1', transform: 'translateY(5px) rotate(-1deg)' },
            '100%': { opacity: '1', transform: 'translateY(0) rotate(-2deg)' },
        }
      },
      animation: {
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'bouncy-fade-in': 'bouncy-fade-in 1s ease-out forwards',
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