/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
        'secondary': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#8B5CF6',
        secondary: '#049c9e',
        tertiary: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        'text-dark': '#FFFFFF',
        'text-medium': '#D1D5DB',
        'text-light': '#9CA3AF',
        'background-main': '#0F172A',
        'background-light': '#1E293B',
        'background-dark': '#020617',
        'border-color': '#334155',
      },
      boxShadow: {
        'card': '0 4px 15px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.4)',
        'button': '0 4px 10px rgba(139, 92, 246, 0.4)',
      },
      borderRadius: {
        'card': '16px',
        'button': '8px',
      },
      transitionProperty: {
        'smooth': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
