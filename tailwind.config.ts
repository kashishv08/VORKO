/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // includes client and freelancer pages
    "./src/components/**/*.{js,ts,jsx,tsx}", // optional if you use components here
    "./node_modules/stream-chat-react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        surfaceGlass: "var(--surface-glass)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        highlight: "var(--highlight)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      boxShadow: {
        glow: "0 12px 28px var(--shadow)",
      },
      borderRadius: {
        xl: "14px",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ["data-state-active"],
    },
  },
};
