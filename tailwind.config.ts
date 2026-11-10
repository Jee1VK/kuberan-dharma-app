import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stitch: {
          maroon: "#6B1D2F",
          maroonHover: "#521422",
          gold: "#C5A059",
          deepGold: "#8F6E28",
          ivory: "#FAFAF7",
          parchment: "#F3EFE6",
          slate: "#1C1917",
          stone: "#57534E",
          sand: "#E4DEC8",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Cinzel", "Georgia", "serif"],
        cinzel: ["Cinzel", "Georgia", "serif"],
        devanagari: ["'Noto Sans Devanagari'", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(28, 25, 23, 0.05), 0 2px 6px -1px rgba(28, 25, 23, 0.03)",
        cardHover: "0 10px 25px -3px rgba(107, 29, 47, 0.08), 0 4px 10px -2px rgba(197, 160, 89, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
