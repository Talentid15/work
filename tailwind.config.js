/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "custom-purple": "0px 2px 17.6px 0px #803CD8",
        "custom-green": "0px 2px 17.6px 0px #3DBF28", 
      },
    },
  },
  plugins: [],
};
