/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        ink: "#0f0f0f",
        paper: "#f5f4f0",
        red: { brand: "#e84040" },
        yellow: { brand: "#f5c842" },
        blue: { brand: "#4fa3e0" },
        green: { brand: "#2ecc71" },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius))",
        sm: "calc(var(--radius))",
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
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 20s linear infinite",
        "spin-slow": "spin-slow 12s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    "bg-[#e84040]",
    "bg-[#f5c842]",
    "bg-[#4fa3e0]",
    "bg-[#2ecc71]",
    "text-[#e84040]",
    "text-[#f5c842]",
    "text-[#4fa3e0]",
    "text-[#2ecc71]",
    "border-[#e84040]",
    "border-[#f5c842]",
    "border-[#4fa3e0]",
  ],
};
