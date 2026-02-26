/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        "mono-tech": ["Share Tech Mono", "monospace"],
        sans: ["Share Tech Mono", "monospace"],
        mono: ["Share Tech Mono", "monospace"],
      },
      colors: {
        "neon-cyan": "oklch(0.8 0.2 195)",
        "neon-magenta": "oklch(0.7 0.35 320)",
        "neon-green": "oklch(0.8 0.3 145)",
        "surface-0": "oklch(0.06 0.02 220)",
        "surface-1": "oklch(0.1 0.025 220)",
        "surface-2": "oklch(0.14 0.03 220)",
        "surface-3": "oklch(0.18 0.03 220)",
        background: "oklch(0.08 0.02 220)",
        foreground: "oklch(0.95 0.02 220)",
        border: "oklch(0.25 0.04 220)",
        input: "oklch(0.15 0.03 220)",
        ring: "oklch(0.8 0.2 195)",
        primary: {
          DEFAULT: "oklch(0.8 0.2 195)",
          foreground: "oklch(0.08 0.02 220)",
        },
        secondary: {
          DEFAULT: "oklch(0.15 0.03 220)",
          foreground: "oklch(0.85 0.05 220)",
        },
        muted: {
          DEFAULT: "oklch(0.15 0.02 220)",
          foreground: "oklch(0.55 0.04 220)",
        },
        accent: {
          DEFAULT: "oklch(0.8 0.2 195)",
          foreground: "oklch(0.08 0.02 220)",
        },
        destructive: {
          DEFAULT: "oklch(0.6 0.25 25)",
          foreground: "oklch(0.98 0.01 0)",
        },
        card: {
          DEFAULT: "oklch(0.12 0.025 220)",
          foreground: "oklch(0.95 0.02 220)",
        },
        popover: {
          DEFAULT: "oklch(0.1 0.025 220)",
          foreground: "oklch(0.95 0.02 220)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "neon-cyan": "0 0 10px oklch(0.8 0.2 195), 0 0 20px oklch(0.8 0.2 195 / 0.3)",
        "neon-magenta": "0 0 10px oklch(0.7 0.35 320), 0 0 20px oklch(0.7 0.35 320 / 0.3)",
        "neon-green": "0 0 10px oklch(0.8 0.3 145), 0 0 20px oklch(0.8 0.3 145 / 0.3)",
        "neon-cyan-sm": "0 0 6px oklch(0.8 0.2 195 / 0.6)",
        "neon-magenta-sm": "0 0 6px oklch(0.7 0.35 320 / 0.6)",
        "neon-green-sm": "0 0 6px oklch(0.8 0.3 145 / 0.6)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
