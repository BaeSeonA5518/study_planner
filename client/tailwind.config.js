/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(99,102,241,0.07)',
        'card-hover': '0 4px 24px rgba(99,102,241,0.14)',
        'btn':   '0 2px 10px rgba(124,58,237,0.3)',
      },
      backgroundImage: {
        'page': 'radial-gradient(ellipse at 10% 0%, rgba(99,102,241,0.1) 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(6,182,212,0.08) 0%, transparent 50%), linear-gradient(160deg, #eef2ff 0%, #f0fdf4 50%, #eff6ff 100%)',
      },
    },
  },
  plugins: [],
};
