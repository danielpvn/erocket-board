/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7A1E2E',
          hover: '#611725',
          light: '#f9f1f2',
        },
        gold: {
          50: '#fbf8f0',
          300: '#d9b869',
          500: '#b8902e',
        },
      },
    },
  },
  plugins: [],
};
