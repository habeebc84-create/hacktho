/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1B3A2F',
        moss: '#7FA88C',
        soil: '#5A4632',
        sunlight: '#F2B84B',
        cream: '#F7F3E9',
        bloom: '#E8A0A0'
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['IBM Plex Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
