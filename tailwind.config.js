/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        santes: {
          orange: '#fc4c02',
          dark: '#1c1c1c'
        }
      }
    }
  },
  plugins: []
};
