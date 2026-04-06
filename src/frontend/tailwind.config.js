import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        fredoka: ["Fredoka One", "cursive"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // App-specific brand tokens
        quiz: {
          teal: "oklch(var(--quiz-teal))",
          mint: "oklch(var(--quiz-mint))",
          navy: "oklch(var(--quiz-navy))",
          slate: "oklch(var(--quiz-slate))",
          yellow: "oklch(var(--quiz-yellow))",
          addition: "oklch(var(--quiz-addition))",
          subtraction: "oklch(var(--quiz-subtraction))",
          multiplication: "oklch(var(--quiz-multiplication))",
          division: "oklch(var(--quiz-division))",
          pink: "oklch(var(--quiz-pink))",
          green: "oklch(var(--quiz-green))",
          blue: "oklch(var(--quiz-blue))",
          orange: "oklch(var(--quiz-orange))",
          progress: "oklch(var(--quiz-progress))",
          footer: "oklch(var(--quiz-footer))",
          pagebg: "oklch(var(--quiz-pagebg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        quiz: "20px",
        "quiz-lg": "24px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        card: "0 6px 24px 0 rgba(15,42,74,0.12), 0 2px 8px 0 rgba(15,42,74,0.08)",
        "card-hover": "0 12px 32px 0 rgba(15,42,74,0.18), 0 4px 12px 0 rgba(15,42,74,0.12)",
        "answer-correct": "0 0 0 4px rgba(89,178,75,0.5), 0 8px 24px 0 rgba(89,178,75,0.3)",
        "answer-wrong": "0 0 0 4px rgba(220,50,50,0.5), 0 8px 24px 0 rgba(220,50,50,0.3)",
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
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "mascot-sway": {
          "0%, 100%": { transform: "rotate(-3deg) translateY(0)" },
          "50%": { transform: "rotate(3deg) translateY(-8px)" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        "star-pop": {
          "0%": { transform: "scale(0) rotate(-30deg)", opacity: "0" },
          "60%": { transform: "scale(1.3) rotate(10deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-5px)" },
          "80%": { transform: "translateX(5px)" },
        },
        "pulse-scale": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "timer-tick": {
          from: { strokeDashoffset: "0" },
          to: { strokeDashoffset: "283" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        bounce: "bounce 2s ease-in-out infinite",
        "mascot-sway": "mascot-sway 3s ease-in-out infinite",
        "confetti-fall": "confetti-fall linear forwards",
        "star-pop": "star-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
        shake: "shake 0.4s ease-in-out",
        "pulse-scale": "pulse-scale 0.6s ease-in-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};