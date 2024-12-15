/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#E5E1DA',
          secondary: '#D1CCC4',
          accent: '#B4AEA4',
          text: '#4A4A4A',
          hover: '#F0EDE8'
        },
        dark: {
          primary: '#222831',
          secondary: '#393E46',
          accent: '#2D333D',
          text: '#EEEEEE',
          hover: '#2C3440'
        }
      }
    }
  },
  plugins: [],
}
