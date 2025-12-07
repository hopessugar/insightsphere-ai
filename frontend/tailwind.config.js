/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22d3ee', // cyan
          dark: '#0891b2',
        },
        secondary: {
          DEFAULT: '#8b5cf6', // purple
          dark: '#6d28d9',
        },
        accent: {
          DEFAULT: '#ec4899', // pink
        },
        dark: {
          DEFAULT: '#050816',
          lighter: '#0f172a',
          card: 'rgba(255, 255, 255, 0.05)',
        },
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
