module.exports = {
  darkMode: "class",
  content: ["./public/index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          500: "#D946EF",
          600: "#C026D3",
          700: "#A21CAF",
        },
      },
    },
  },
  plugins: [],
};
