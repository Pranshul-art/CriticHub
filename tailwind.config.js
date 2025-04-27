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
          50:  '#fff4f1',
          100: '#FFE5DC',
          200:  '#ffc8b9',
          300: 'FFA991',
          400:  '#ff816e',
          500: '#FF7F50',
          600: '#FF6A39',
          700:  '#bf3d32',
          800:  '#99322b',
          900:  '#7a2925',
        },
        coral:'#FF7F50',
        'coral-500': '#FF7F50',
        navy:{
          500:'#a1b0d3',
          600: '#3f537d',
          700: '#2d3f63',
          800: '#1f2f4b',
          900: '#131f33'
        },
        cream:'#ffd966',
        'light-cream':'#FFF9E6',
        dark:'#002621',
        'light-dark':'#00c2a8',
        gray: {
          50:'#f9fafb',
          100:'#f3f4f6',
          200:'#e5e7eb',
          300:'#d1d5db',
          400:'#9ca3af',
          500:'#6b7280',
          600:'#4b5563',
          700:'#374151',
          800:'#1f2937',
          900:'#111827'
        },
        
        teal:'#008080',
        blue:{
          50:   '#eff6ff',
          100:  '#dbeafe',
          200:  '#bfdbfe',
          300:  '#93c5fd',
          400:  '#60a5fa',
          500:  '#3b82f6',
          600:  '#2563eb',
          700:  '#1d4ed8',
          800:  '#1e40af',
          900:  '#1e3a8a',
        },
        purple:{
          50:   '#faf5ff',
          100:  '#f3e8ff',
          200:  '#e9d5ff',
          300:  '#d8b4fe',
          400:  '#c084fc',
          500:  '#a855f7',
          600:  '#9333ea',
          700:  '#7e22ce',
          800:  '#6b21a8',
          900:  '#581c87',
        }
      }
    },
  },
  plugins: [],
}

