import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#faf6ef",
        sand: "#f2ecdf",
        ink: {
          DEFAULT: "#1d1b18",
          soft: "#57534a",
        },
        gold: {
          50: "#faf6e9",
          100: "#f3ead0",
          200: "#e8d8ae",
          300: "#dcc289",
          400: "#cfa968",
          500: "#b98f3e",
          600: "#9c742d",
          700: "#7d5b22",
          800: "#5f4419",
          900: "#44300f",
        },
        wine: {
          50: "#fbf0f1",
          100: "#f5dcdd",
          200: "#eec6c9",
          300: "#e0a2a7",
          400: "#c8737b",
          500: "#a24a52",
          600: "#8a3640",
          700: "#6f2a33",
        },
        brand: {
          50: "#faf6e9",
          100: "#f3ead0",
          200: "#e8d8ae",
          300: "#dcc289",
          400: "#cfa968",
          500: "#b98f3e",
          600: "#9c742d",
          700: "#7d5b22",
          800: "#5f4419",
          900: "#44300f",
        },
        accent: {
          50: "#fbf0f1",
          100: "#f5dcdd",
          200: "#eec6c9",
          300: "#e0a2a7",
          400: "#c8737b",
          500: "#a24a52",
          600: "#8a3640",
          700: "#6f2a33",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": {
            opacity: "0.5",
            transform: "translateZ(0) scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "translateZ(0) scale(1.08)",
          },
        },
        "ken-burns": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.08)" },
        },
        "text-glow": {
          "0%, 100%": {
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(185, 143, 62, 0.2)",
          },
          "50%": {
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(185, 143, 62, 0.4), 0 0 60px rgba(185, 143, 62, 0.15)",
          },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "sparkle-rise": {
          "0%": { opacity: "0", transform: "translateY(0) scale(0)" },
          "15%": { opacity: "1", transform: "translateY(-30px) scale(1)" },
          "85%": { opacity: "0.8" },
          "100%": { opacity: "0", transform: "translateY(-300px) scale(0.3)" },
        },
        "confetti-drift": {
          "0%": { opacity: "0", transform: "translateY(-20px) rotate(0deg) scale(0.6)" },
          "10%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(320px) rotate(720deg) scale(0.2)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)", opacity: "0" },
          "20%": { opacity: "0.5" },
          "80%": { transform: "translateX(200%) skewX(-15deg)", opacity: "0" },
          "100%": { transform: "translateX(200%) skewX(-15deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(250%) skewX(-20deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.8s ease-out both",
        "zoom-in": "zoom-in 0.7s ease-out both",
        float: "float 5s ease-in-out infinite",
        "float-delayed": "float 5s ease-in-out 2.5s infinite",
        glow: "glow 6s ease-in-out infinite",
        "ken-burns": "ken-burns 14s ease-in-out infinite alternate",
        "text-glow": "text-glow 4s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        sway: "sway 6s ease-in-out infinite",
        "sparkle-rise": "sparkle-rise 4s ease-out infinite",
        "confetti-drift": "confetti-drift 6s ease-in-out infinite",
        shine: "shine 3.2s ease-in-out infinite",
        shimmer: "shimmer 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
