/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./features/*.{ts,tsx}", "./components/ui/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [require("tailwindcss-animate")]
}
