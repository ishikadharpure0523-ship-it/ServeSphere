/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        teal:  { DEFAULT:'#1D9E75', light:'#E1F5EE', dark:'#0F6E56', mid:'#5DCAA5' },
        amber: { DEFAULT:'#F59E0B', light:'#FAEEDA', dark:'#B45309' },
        coral: { DEFAULT:'#F97316', light:'#FFF0E8' },
        ink:   { DEFAULT:'#1A1A14', 2:'#2E2E26', 3:'#444438' },
        sand:  '#FAFAF8',
        warm: '#F4F3EE',
        muted: '#6B6B5F',
      }
    },
  },
  plugins: [],
}
