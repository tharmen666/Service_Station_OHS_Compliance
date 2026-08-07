/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hazard: {
          red: '#EF4444',
          amber: '#F59E0B',
          blue: '#3B82F6',
          green: '#10B981',
          dark: '#0F172A',
          card: '#1E293B',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 1s ease-in-out 2',
      }
    },
  },
  plugins: [],
}
