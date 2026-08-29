/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0057FF',
        'brand-light': '#3D7FFF',
        'brand-pale': '#7AABFF',
        'brand-dark': '#003DB3',
      },
    },
  },
  plugins: [],
}
