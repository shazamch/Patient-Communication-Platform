/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'myblue': '#1985C5',
        'mylightblue': '#F3F6FF',
      },
    },
  },
  plugins: [],
}