/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060F1F",
          900: "#0B1B33",
          800: "#122544",
          700: "#1A3358",
          600: "#254473",
          500: "#33578F",
        },
        gold: {
          400: "#E3C567",
          500: "#C9A227",
          600: "#A6841D",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(6, 15, 31, 0.35)",
      },
    },
  },
  plugins: [],
};
