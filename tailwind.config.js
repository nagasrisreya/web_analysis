/** @type {import('tailwindcss').Config} */
export default {
  content: ["./frontend/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0d1117",
        light: "#f0f6fc",
        accent: "#58a6ff",
      },
    },
  },
  plugins: [],
};
