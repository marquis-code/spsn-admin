/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A8B5', 
          light: '#4FD1C5',
          dark: '#087E8B',
        },
        secondary: {
          DEFAULT: '#E53E3E', 
          light: '#FC8181',
          dark: '#9B2C2C',
        },
        accent: {
          DEFAULT: '#2D3748', 
          light: '#4A5568',
          dark: '#1A202C',
        },
         brand: {
          blue: '#1A365D',
          dark: '#033958',
          cyan: '#00A8B5',
          accent: '#00D1FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
