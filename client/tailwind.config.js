/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        xl: "1200px",
      },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        border: "var(--border)",
        fg: "var(--text)",
        "fg-2": "var(--text-2)",
        "fg-3": "var(--text-3)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "18px",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        card: "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 8px 24px -4px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 20px 35px -10px rgba(255, 75, 38, 0.18), 0 10px 20px -5px rgba(15, 23, 42, 0.06)",
        floating: "0 20px 40px -15px rgba(15, 23, 42, 0.18), 0 0 1px 1px rgba(15, 23, 42, 0.05)",
        glow: "0 0 25px rgba(255, 75, 38, 0.35)",
        "glow-accent": "0 0 25px rgba(139, 92, 246, 0.35)",
      },
      keyframes: {
        float: {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(20px, -20px, 0) scale(1.05)" },
          "100%": { transform: "translate3d(-10px, 15px, 0) scale(0.95)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
      },
      animation: {
        float: "float 16s ease-in-out infinite alternate",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
