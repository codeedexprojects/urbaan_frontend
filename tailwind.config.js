/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Lora', 'sans-serif'],
      },
      colors: {
        primary: "#C21E56",
        secondary: "#202224",
        tertiary: "#F5F6FA",
        quaternary: "#F1F4F9",
        userBg: "#F2F6FF",
        footerBg: "#021526",
        loginIconBg: "#ECECEC",
        buttonBg: "#4880FF",
        ratingBg: "#FFCA28",
        deleteBg: "#F44336",
        editBg: "#E2EBF8",
        pendingBg: "#6777EE",
        processingBg: "#FFA425",
        intransistBg:'#9a3412',
        cancelBg: "#FB544B",
        shippedBg: "#66BB6A",
        deliveredBg: "#38BAF4",
        searchUser: "#D8DFED",
        O1: "#8280FF",
        O2: "#FEC53D",
        O3: "#4AD991",
        O4: "#F93C65"
      },
    },
  },
  plugins: [],
});

