/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0E5C56',
          50: '#E6F2F0',
          100: '#C2DFDA',
          400: '#1D7F76',
          600: '#0E5C56',
          700: '#0A453F',
          900: '#062D29',
        },
        ink: '#1B1F23',
        cloud: '#F6F7F5',
        coral: {
          DEFAULT: '#FF6F59',
          50: '#FFEDE9',
          600: '#FF6F59',
          700: '#E5543F',
        },
        marigold: {
          DEFAULT: '#F2A93B',
          50: '#FDF1DD',
          600: '#F2A93B',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(27, 31, 35, 0.06)',
        cardHover: '0 8px 24px rgba(27, 31, 35, 0.12)',
      },
      borderRadius: {
        tag: '4px 10px 10px 4px',
      },
    },
  },
  plugins: [],
};
