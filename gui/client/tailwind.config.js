const path = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.resolve(__dirname, "index.html"),
    path.resolve(__dirname, "src/**/*.{ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        vf: {
          bg: "#f5f0e8",
          surface: "#faf8f3",
          border: "#d9d2c7",
          accent: "#d4732a",
          "accent-hover": "#b85f1e",
          "accent-light": "#f5e6d8",
          success: "#5a9a6b",
          warn: "#c98a2e",
          danger: "#c44230",
          text: "#2d2a26",
          muted: "#6b6560",
          ink: "#1a1816",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
