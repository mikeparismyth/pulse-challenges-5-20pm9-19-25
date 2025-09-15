import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        // Gaming Color Palette
        'pulse-purple': '#8E1EFE',
        'pulse-teal': '#30FFE6',
        'pulse-dark': '#0F0F23',
        'pulse-darker': '#0A0A1A',
        'pulse-gray': '#1A1A2E',
        'pulse-light-gray': '#16213E',
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'gaming': '1rem',
        'gaming-lg': '1.5rem',
        'gaming-xl': '2rem',
      },
      spacing: {
        'gaming-xs': '0.5rem',
        'gaming-sm': '0.75rem',
        'gaming-md': '1rem',
        'gaming-lg': '1.5rem',
        'gaming-xl': '2rem',
        'gaming-2xl': '3rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'gaming-bounce': 'gaming-bounce 1s ease-in-out infinite',
      },
      backdropBlur: {
        'xs': '2px',
        'gaming': '12px',
        'gaming-heavy': '20px',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(142, 30, 254, 0.3)',
        'glow-teal': '0 0 20px rgba(48, 255, 230, 0.3)',
        'glow-subtle': '0 0 10px rgba(255, 255, 255, 0.1)',
        'gaming-card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'gaming-hover': '0 12px 40px rgba(142, 30, 254, 0.2)',
      },
      fontFamily: {
        'gaming': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'gaming-xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'gaming-sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'gaming-2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],
        'gaming-3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '0.025em' }],
        'gaming-4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '0.025em' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        'accordion-up': {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(142, 30, 254, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(142, 30, 254, 0.6)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'gaming-bounce': {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      screens: {
        'xs': '475px',
        'gaming-mobile': '390px',
        'gaming-tablet': '768px',
        'gaming-desktop': '1024px',
        'gaming-wide': '1440px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config