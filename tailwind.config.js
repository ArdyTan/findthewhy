/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        ink: '#1A1B1F',
        terracotta: {
          DEFAULT: '#C2410C',
          dark: '#9A330A',
          light: '#E8714A',
        },
        navy: {
          DEFAULT: '#0F2A3F',
          light: '#1E4A6B',
        },
        muted: '#8C8579',
        rule: '#E8E1D5',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        prose: '720px',
      },
    },
  },
  plugins: [],
}
