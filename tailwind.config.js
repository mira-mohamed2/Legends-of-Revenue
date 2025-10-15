/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#fdf2d0',
          dark: '#f5e6b8',
          light: '#fffdf5',
          100: '#fffef9',
          200: '#fdf8e8',
          700: '#d4c5a0',
        },
        emerald: {
          DEFAULT: '#1f5d3b',
          light: '#2a7a4f',
          dark: '#164429',
          700: '#1f5d3b',
          800: '#164429',
          900: '#0d2e1c',
          950: '#081a0f',
        },
        gold: {
          DEFAULT: '#c99a2e',
          light: '#ddb24a',
          dark: '#a67d1f',
        },
        brown: {
          DEFAULT: '#3b2b1a',
          600: '#4a3821',
          700: '#3b2b1a',
          800: '#2c2013',
          900: '#1d150c',
        },
      },
      fontFamily: {
        medieval: ['"Cinzel"', 'serif'],
        body: ['"EB Garamond"', 'serif'],
      },
      backgroundImage: {
        'parchment-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence baseFrequency=\"0.9\" /%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.05\" /%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
