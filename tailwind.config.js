module.exports = {
  purge: ['apps/**/*.{ts,html}', 'libs/web/**/*.{ts,html}'],
  mode: 'jit',
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-1': 'var(--primary-1)',
        'primary-translucent': 'var(--primary-translucent)',
      },
      backgroundImage: {
        'primary-gradient': 'var(--primary-gradient)',
      },
    },
    minHeight: {
      2: '40px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
