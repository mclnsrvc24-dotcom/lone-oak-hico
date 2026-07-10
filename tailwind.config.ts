import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1b2417",
        forest: {
          DEFAULT: "#2f4d34",
          light: "#3f6446",
          dark: "#1f3423",
        },
        oak: {
          DEFAULT: "#6b4226",
          light: "#8a5a37",
        },
        moss: "#6f8f5a",
        gold: {
          DEFAULT: "#c9972c",
          light: "#e0b755",
        },
        bone: "#f5f1e6",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
