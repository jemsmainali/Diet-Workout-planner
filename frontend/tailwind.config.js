/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'brand-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
          DEFAULT: '#dc2626',
        },
        surface: '#121216',
        'surface-alt': '#1b1b21',
        'macro-protein': '#ef4444',
        'macro-carbs': '#f59e0b',
        'macro-fats': '#fb7185',
        gym: {
          black: '#050506',
          red: '#ff1f3d',
          glass: 'rgba(255,255,255,0.08)',
        },
      },
    },
  },
  plugins: [],
};
