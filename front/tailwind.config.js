/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', 
  plugins: [require('tailwindcss-motion')],
}


/* 
Fondo: #1E2632 ${isDarkMode ? 'bg-[#323F49]' : 'bg-gray-50'}
Card: #323F49
Inputs: #04FEC7
FondoOscuro: #0C1622
Texto: #7F8B98 
*/