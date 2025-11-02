/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // přidáno mdx
    "./public/index.html", // pokud někdy používáš
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};