module.exports = {
  purge: ['src/**/*.{ts,html}', 'projects/**/*.{ts,html}'],
  mode: 'jit',
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
