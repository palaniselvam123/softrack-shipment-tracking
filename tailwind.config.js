/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        /* LogiTRACK brand navy — primary actions, headings, active nav */
        navy: {
          50: '#f4f6f8',
          100: '#e6eaef',
          200: '#c9d2dc',
          300: '#9caabd',
          400: '#6a7d97',
          500: '#465c7a',
          600: '#2f4763',
          700: '#22374f',
          800: '#16283b',
          900: '#0f2c4c',
          950: '#0a1c30',
        },
        /* Accent blue — the "Logi" wordmark, links, selected rows */
        brand: {
          50: '#eff5ff',
          100: '#dbe7fe',
          200: '#bfd5fe',
          300: '#93bafd',
          400: '#6094fa',
          500: '#3b74f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        /* Neutral surface ramp used for page bg, tiles, borders, table heads */
        surface: {
          DEFAULT: '#ffffff',
          page: '#f1f3f6',
          tile: '#f3f4f7',
          head: '#f7f8fa',
          line: '#e3e6eb',
          soft: '#edeff2',
        },
        /* kept so existing markup that still references it keeps compiling */
        'logitrack-blue': {
          50: '#eff5ff',
          100: '#dbe7fe',
          200: '#bfd5fe',
          300: '#93bafd',
          400: '#6094fa',
          500: '#3b74f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      borderRadius: {
        card: '8px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        pop: '0 8px 24px -6px rgba(16, 24, 40, 0.12)',
      },
      fontSize: {
        label: ['12px', { lineHeight: '16px' }],
        field: ['13px', { lineHeight: '18px' }],
      },
    },
  },
  plugins: [],
};
