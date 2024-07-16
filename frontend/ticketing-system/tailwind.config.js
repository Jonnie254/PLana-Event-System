/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: { poppins: ["Poppins", "sans-serif"] },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(100%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideOut: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(100%)" },
        },
        animation: {
          slideIn: "slideIn 0.5s ease-out forwards",
          slideOut: "slideOut 0.5s ease-out forwards",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
