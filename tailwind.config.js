/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pl: {
          primary: '#38003c',    // Ungu Utama (Header/Nav)
          dark: '#1f0022',       // Background Gelap (Body)
          card: '#2c0030',       // Background untuk Card/Table
          cyan: '#00ff85',       // Hijau Neon (Aksen Utama)
          pink: '#e90052',       // Pink (Aksen Sekunder)
          gray: '#989898',       // Teks Sekunder
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': "linear-gradient(to right, #38003c, #500056)",
      }
    },
  },
  plugins: [],
}