/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#fff1f4',100:'#ffe4e9',200:'#ffccd7',300:'#ffa3b6',400:'#ff6f8c',500:'#FF3F6C',600:'#e6365f',700:'#bf2d4f',800:'#a02845',900:'#85263e' }
      }
    }
  },
  plugins: [],
};
