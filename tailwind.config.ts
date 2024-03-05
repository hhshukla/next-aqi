import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitiontimingfunction: {
        "transition-of-Indicator": "cubic-bezier(0.165, 0.84, 0.44, 1)",
      },
      // animation: {
      //   border: "border 4s ease infinite",
      // },
      // keyframes: {
      //   border: {
      //     "0%, 100%": { backgroundPosition: "0% 50%" },
      //     "50%": { backgroundPosition: "100% 50%" },
      //   },
      //   animateBorder: {
      //     "0%": {
      //       borderImageSlice: "1",
      //     },
      //     "50%": {
      //       borderImageSlice: "2",
      //     },
      //     "100%": {
      //       borderImageSlice: "1",
      //     },
      //   },
      //   "border-spin": {
      //     "100%": {
      //       transform: "rotate(-360deg)",
      //     },
      //   },
      // },
      animation1: {
        "border-spin": "border-spin 7s linear infinite",
      },
      animation: {
        "animate-border": "animateBorder 2s ease infinite",
      },
      keyframes: {
        animateBorder: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "blue-500" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
