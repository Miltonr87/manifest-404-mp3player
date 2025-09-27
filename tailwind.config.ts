import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Player specific colors
        'neon-green': 'hsl(var(--neon-green))',
        'neon-cyan': 'hsl(var(--neon-cyan))',
        'neon-blue': 'hsl(var(--neon-blue))',
        'player-bg': 'hsl(var(--player-bg))',
        'player-panel': 'hsl(var(--player-panel))',
        'digital-text': 'hsl(var(--digital-text))',
        'equalizer-bar': 'hsl(var(--equalizer-bar))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(var(--glow) / 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(var(--glow) / 0.8), 0 0 30px hsl(var(--glow) / 0.4)",
          },
        },
        "equalizer-bounce": {
          "0%, 100%": {
            transform: "scaleY(0.3)",
          },
          "50%": {
            transform: "scaleY(1)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "equalizer-pulse": {
          "0%": {
            transform: "scaleY(1)",
          },
          "50%": {
            transform: "scaleY(1.2)",
          },
          "100%": {
            transform: "scaleY(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "equalizer-1": "equalizer-bounce 0.3s ease-in-out infinite",
        "equalizer-2": "equalizer-bounce 0.4s ease-in-out infinite",
        "equalizer-3": "equalizer-bounce 0.5s ease-in-out infinite",
        "equalizer-4": "equalizer-bounce 0.6s ease-in-out infinite",
        "equalizer-5": "equalizer-bounce 0.7s ease-in-out infinite",
        "equalizer-pulse": "equalizer-pulse 0.1s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
