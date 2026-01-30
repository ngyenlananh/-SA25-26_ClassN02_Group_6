/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1c1e',
        accent: '#d4a373',
        bg: '#0f1113',
        surface: '#1e2022',
        text: '#e1e2e5',
        'text-dim': '#909499',
        success: '#4ade80',
        danger: '#fb7185',
        warning: '#facc15',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulsefast: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        'pulse-fast': 'pulsefast 0.7s cubic-bezier(0.4,0,0.6,1) infinite',
      }
    },
  },
  plugins: [],
}