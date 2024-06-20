/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        border: "var(--border)",
        switchBg: "var(--switch-bg)",
        sliderBg: "var(--slider-bg)",
      },
    },
  },
  plugins: [],
};