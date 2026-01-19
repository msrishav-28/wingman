import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050505',

          surface: '#0A0A0A',
          elevated: '#141414',
          hover: '#1F1F1F',
          card: '#0F0F0F',
        },
        neon: {
          purple: '#7B61FF',
          blue: '#00D4FF',
          pink: '#FF006E',
          green: '#00FF94',
          yellow: '#FFD93D',
          orange: '#FF6B35',
        },

        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          tertiary: '#808080',
          muted: '#888888',
          disabled: '#404040',
        },
        status: {
          success: '#00FF94',
          'success-dark': '#00CC6A',
          warning: '#FFA502',
          'warning-dark': '#E59400',
          danger: '#FF2E2E',
          'danger-dark': '#E63946',
          info: '#00D4FF',
          'info-dark': '#00B8E6',
        },

        attendance: {
          present: '#00FF94',
          absent: '#FF2E2E',

          holiday: '#FFD93D',
          medical: '#00D4FF',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],

        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        base: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px rgba(0, 0, 0, 0.15)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.2)',
        xl: '0 16px 32px rgba(0, 0, 0, 0.25)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.3)',
        'glow-purple': '0 0 20px rgba(176, 38, 255, 0.6)',
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.6)',
        'glow-pink': '0 0 20px rgba(255, 0, 110, 0.6)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.6)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(176, 38, 255, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(176, 38, 255, 0.8)' },
        },
        scanline: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glowPulse 2s infinite',
        'scanline': 'scanline 2s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
