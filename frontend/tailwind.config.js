/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ['Poppins', "sans-serif"],
    },
    extend: {
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px":"400px"
      },
      colors: {
        'dark-bg': '#1a1c23',
        'dark-secondary': '#242631',
        'dark-text': '#a0aec0',
        'navy-blue': '#0A192F',
        'navy-dark': '#0D1B2A',
        'gold': '#FFD700',
        'gold-light': '#FFE55C',
        'silver': '#C0C0C0',
        'silver-light': '#E5E5E5',
        'bronze': '#CD7F32',
        'bronze-light': '#DDA15E',
      }
    },
  },
  plugins: [],
};
