/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7ff',
          100: '#e7ecff',
          200: '#c8d5ff',
          300: '#9db7ff',
          400: '#7290ff',
          500: '#4a68f2',
          600: '#374cc7',
          700: '#2f3fa1',
          800: '#2d3781',
          900: '#293263'
        }
      },
      boxShadow: {
        soft: '0 25px 60px rgba(15, 23, 42, 0.16)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(74,104,242,0.24), transparent 32%), linear-gradient(135deg, rgba(248,250,252,0.94), rgba(226,232,240,0.88))',
        'hero-grid-dark':
          'radial-gradient(circle at top, rgba(96,165,250,0.2), transparent 30%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.92))'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

