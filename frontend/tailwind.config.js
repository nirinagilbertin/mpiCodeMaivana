export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
 theme: {
    extend: {
      colors: {
        primary: '#1A1F26',
        'primary-dark': '#0F131A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}