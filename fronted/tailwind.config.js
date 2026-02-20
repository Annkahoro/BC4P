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
          light: '#2ecc71',
          DEFAULT: '#27ae60',
          dark: '#1e8449',
        },
        secondary: {
          light: '#34495e',
          DEFAULT: '#2c3e50',
          dark: '#212f3c',
        },
        accent: {
          light: '#a29bfe',
          DEFAULT: '#6c5ce7',
          dark: '#4834d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
