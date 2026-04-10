/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Forest + Sky Design System
        forest: {
          50: '#F0FFF4',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#95D5B2',
          400: '#74C69D',
          500: '#52B788',
          600: '#40916C',
          700: '#2D6A4F',
          800: '#1B4332',
          900: '#081C15',
        },
        sky: {
          50: '#E8FAFE',
          100: '#C5F0FB',
          200: '#90E4F7',
          300: '#6BDAF3',
          400: '#4CC9F0',
          500: '#3AB5D9',
          600: '#2A9ABF',
          700: '#1D7FA3',
          800: '#146587',
          900: '#0B4A6B',
        },

        // Semantic tokens
        primary: '#1B4332',
        'primary-light': '#2D6A4F',
        secondary: '#2D6A4F',
        accent: '#40916C',
        'accent-light': '#B7E4C7',
        cta: '#4CC9F0',
        'cta-hover': '#3AB5D9',
        'cta-light': '#E8FAFE',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        'text-primary': '#081C15',
        'text-secondary': '#52796F',
        'text-muted': '#95A5A0',
        'border-light': '#D8F3DC',
        'border-default': '#B7E4C7',

        // Status colors
        success: '#2D6A4F',
        warning: '#E9C46A',
        danger: '#E76F51',
        info: '#4CC9F0',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-down': 'fadeDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(27, 67, 50, 0.06), 0 4px 12px rgba(27, 67, 50, 0.04)',
        'card-hover': '0 4px 16px rgba(27, 67, 50, 0.1), 0 8px 32px rgba(27, 67, 50, 0.06)',
        'elevated': '0 8px 30px rgba(27, 67, 50, 0.08)',
        'nav': '0 2px 16px rgba(27, 67, 50, 0.08)',
        'cta': '0 4px 14px rgba(76, 201, 240, 0.35)',
        'cta-hover': '0 6px 20px rgba(76, 201, 240, 0.45)',
        'inner': 'inset 0 2px 4px rgba(27, 67, 50, 0.04)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
        'gradient-sky': 'linear-gradient(135deg, #4CC9F0 0%, #3AB5D9 100%)',
        'gradient-forest-sky': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #4CC9F0 100%)',
        'gradient-surface': 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #F0FFF4 100%)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};