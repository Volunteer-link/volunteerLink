/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#3BA769",
      },
      boxShadow: {
        "custom-green": "0 16px 40px rgba(59, 167, 105, 0.8)",
      },

      // textShadow: {
      //   DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Bóng nhỏ
      //   lg: "4px 4px 6px rgba(0, 0, 0, 0.5)", // Bóng lớn
      // },
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
