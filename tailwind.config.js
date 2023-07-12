/* eslint-env node */
/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/index.html", "./src/**/*.{html,scss,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        html: { color: theme("colors.gray.800") },
      });
    }),
  ],
};
