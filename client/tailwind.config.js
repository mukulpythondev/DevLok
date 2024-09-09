/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          100: '#1E1E1E', // Light black for background
          200: '#2D2D2D', // Slightly darker black for elements
          300: '#383838', // Elements background
          400: '#4D4D4D', // Hover/Active elements
          500: '#6E6E6E', // Borders/Dividers
          600: '#9A9A9A', // Muted text
          700: '#C5C5C5', // Regular text
          800: '#FFFFFF', // High-contrast text (use for dark themes)
        },
       
      },
      fontFamily: {
        concertOne: ["Concert One", "sans-serif"],
        ropaOne: ["Ropa Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
