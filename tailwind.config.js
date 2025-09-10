// tailwind.config.js
module.exports = {
  darkMode: "class", // toggle with .dark
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",        // light page bg
        secondary: "#F8F9FA",      // light sidebar bg
        dark: "#111827",            // strong text (light)
        dark01: "#505054",            // strong text (light)
        muted: "#6B7280",           // muted text (light)
        muted01: "#5e6572",           // muted text (light)
        border: "#E5E5E5",          // light border
        accent: "#21808D",        // Perplexity True Turquoise accent
        lightAccent: "#56B8C3",        // lighter turquoise
        pHover: "#f4f4f4",
        sHover: "#e8e5e5",
      },
      height: {
        screen: '100dvh', // replaces '100vh' with '100dvh' for better mobile behavior
      },
    },
  },
  // plugins: [],
  plugins: [require("@tailwindcss/typography")],
};