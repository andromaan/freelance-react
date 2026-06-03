/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976d2",
          hover: "#1565c0",
        },
        main: "var(--color-bg-main)",
        surface: "var(--color-bg-surface)",
        text: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          light: "var(--color-border-light)",
        },
      },
    },
  },
  plugins: [],
};
