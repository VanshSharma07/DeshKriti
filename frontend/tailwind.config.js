/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        soundWave: {
          '0%': { height: '0.25rem' },
          '50%': { height: '1rem' },
          '100%': { height: '0.25rem' }
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'sound-wave': 'soundWave 0.5s ease-in-out infinite'
      },
    },
    screens: {
      'xl': { 'max': '1200px' },
      'lg': { 'max': '1080px' },
      'md-lg': { 'max': '991px' },
      'md': { 'max': '768px' },
      'sm': { 'max': '576px' },
      'xs': { 'max': '480px' },
      '2xs': { 'max': '340px' },
    },
  },
  plugins: [],
  safelist: [
    'snap-y',
    'snap-mandatory',
    'snap-start',
    'snap-always',
  ],
}
