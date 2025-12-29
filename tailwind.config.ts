import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0C0E",
        surface: "#1A1C1E",
        "surface-hover": "#232528",
        primary: "#96BF48",
        "primary-hover": "#A8D055",
        "primary-dark": "#30E680",
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
        border: {
          DEFAULT: "#2A2D30",
          light: "#3A3D40",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(150, 191, 72, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;

