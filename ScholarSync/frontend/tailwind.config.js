/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#8b5cf6', // Violet
                secondary: '#06b6d4', // Cyan
                dark: '#0f172a', // Slate 900
            },
        },
    },
    plugins: [],
}
