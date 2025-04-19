/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        coral: {
          100: '#FFE5DC',
          300: 'FFA991',
          500: '#FF7F50',
          600: '#FF6A39'
        },
        navy:{
          600: '#3f537d',
          700: '#2d3f63',
          800: '#1f2f4b',
          900: '#131f33'
        },
        cream:'#ffd966',
        'light-cream':'#FFF9E6',
        dark:'#002621',
        'light-dark':'#00c2a8',
        gray: '#E1E1E1'
      }
    },
  },
  plugins: [],
}

