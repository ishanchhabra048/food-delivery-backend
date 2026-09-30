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
        violet: "var(--violet)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Poppins"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "22px",
        xl: "28px",
        "2xl": "36px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(13, 19, 31, 0.04), 0 1px 2px rgba(13, 19, 31, 0.02)",
        card: "0 4px 20px -2px rgba(13, 19, 31, 0.06), 0 2px 6px -1px rgba(13, 19, 31, 0.03)",
        "card-hover": "0 24px 48px -12px rgba(255, 56, 17, 0.22), 0 12px 24px -8px rgba(13, 19, 31, 0.08)",
        floating: "0 20px 40px -15px rgba(13, 19, 31, 0.18), 0 0 1px 1px rgba(13, 19, 31, 0.05)",
        glow: "0 0 30px rgba(255, 56, 17, 0.40)",
        "glow-accent": "0 0 30px rgba(255, 0, 110, 0.40)",
        "glow-emerald": "0 0 30px rgba(0, 179, 104, 0.40)",
      },
      keyframes: {
        float: {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(15px, -18px, 0) scale(1.03)" },
          "100%": { transform: "translate3d(-10px, 12px, 0) scale(0.97)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 14s ease-in-out infinite alternate",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
