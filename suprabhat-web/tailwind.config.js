/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; // Import default theme

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define a beautiful, organic color palette
      colors: {
        'brand-green': '#2a623d', // A deep, rich green
        'brand-green-light': '#3a8654',
        'brand-beige': '#f5f5dc', // A warm, natural background
        'brand-text': '#3a3a3a', // A softer black for text
        'brand-accent': '#ff8c42', // A vibrant orange accent
      },
      // Set Poppins as the primary font
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}