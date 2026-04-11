/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background layers
        bg: {
          base: '#080d1a',
          surface: '#0d1424',
          card: '#111c30',
          elevated: '#16233d',
        },
        // Brand
        brand: {
          50:  '#ede9fe',
          100: '#ddd6fe',
          200: '#c4b5fd',
          300: '#a78bfa',
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        // Accent (cyan)
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Stage colors
        stage: {
          applied:     { bg: '#1e293b', text: '#94a3b8', border: '#334155' },
          screened:    { bg: '#1e3a5f', text: '#60a5fa', border: '#2563eb' },
          interviewing:{ bg: '#3d2900', text: '#fbbf24', border: '#d97706' },
          offered:     { bg: '#2d1f5e', text: '#a78bfa', border: '#7c3aed' },
          hired:       { bg: '#052e16', text: '#34d399', border: '#059669' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(124, 58, 237, 0.35)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
