/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    darkMode: false,
    extend: {
      colors: {
        'primary': '#5a9cf8',
      },
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#2b2d30',
      'secondary': '#26282e',
      'danger': '#e3342f',
      'blue-user': '#5a9cf8',
      'red-user': '#e47470'
    }),
  },
  plugins: [],
}

