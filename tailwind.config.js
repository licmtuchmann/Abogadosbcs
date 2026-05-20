/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mft: {
          navy: '#0B3D6E',
          'navy-light': '#1A5A9A',
          'navy-dark': '#062B50',
          blue: '#004F88',
          gold: '#C9A84C',
          'gold-dark': '#9E7A2A',
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          text: '#1A1A2E',
          'text-secondary': '#4A4A6A',
          'text-muted': '#8A8AA0',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        narrow: ['Arial Narrow', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
