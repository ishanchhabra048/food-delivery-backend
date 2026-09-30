/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        xl: "1180px",
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
          hover: "#E8480F",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "#128A3E",
        },
        accent: "var(--accent)",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(35,26,20,.04), 0 12px 24px -12px rgba(35,26,20,.15)",
        "card-hover": "0 20px 32px -12px rgba(255,90,31,.20)",
        floating: "0 10px 25px -5px rgba(35,26,20,.12), 0 8px 10px -6px rgba(35,26,20,.1)",
      },
      keyframes: {
        float: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(30px,-24px,0)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 20s ease-in-out infinite alternate",
        pulseDot: "pulseDot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
