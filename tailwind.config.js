module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './draft/**/*.{md}',
    './public/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F5BB5',
        accent: '#0B84FF',
        'muted-ink': '#36403c'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', '-apple-system', 'Helvetica Neue', 'Arial']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
}
