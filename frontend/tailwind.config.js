/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        popRed: "#e61741",
        popPurple:"#53006C",
        popGreen:"#428e68",
        logoPurple:"#53006c",
      },
    },
  },
  plugins: [],
}