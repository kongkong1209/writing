import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-dark": "var(--color-primary-dark)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
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
        card: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgba(91, 140, 58, 0.2)",
        "glow-dark": "0 0 20px rgba(150, 191, 72, 0.3)",
        "card-light": "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
        "card-hover-light": "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

