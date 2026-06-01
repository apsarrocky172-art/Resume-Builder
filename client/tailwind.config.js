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
        brand: {
          bgDark: '#0b0f19',
          cardDark: 'rgba(17, 24, 39, 0.7)',
          accent: '#6366f1',
          gradientStart: '#8b5cf6',
          gradientEnd: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
