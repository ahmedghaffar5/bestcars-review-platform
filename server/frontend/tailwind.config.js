module.exports = {
  content: [
    './src/**/*.{js,jsx}',
    './public/index.html',
    './static/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#090B10',
        graphite: '#10141B',
        surface: '#171C25',
        elevated: '#202733',
        platinum: '#F4F3EF',
        champagne: '#D4B77E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
