/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "screen-75": "75vh",
        "screen-70": "70vh",
        "screen-65": "65vh",
        "screen-60": "60vh",
        "screen-55": "55vh",
        "screen-50": "50vh",
      },
      width: {
        "screen-75": "75vw",
        "screen-70": "70vw",
        "screen-65": "65vw",
        "screen-60": "60vw",
        "screen-55": "55vw",
        "screen-50": "50vw",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "ll-panda": "rgb(122,217,248)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require("daisyui"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
