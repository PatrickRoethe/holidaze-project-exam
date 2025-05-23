/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#3B82F6",
        accent: "#F59E0B",
        success: "#10B981",
        error: "#EF4444",
        light: "#F3F4F6",
        dark: "#111827",
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
