/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          sidebar: 'var(--color-sidebar)',
          border: 'var(--color-border)',
          hover: 'var(--color-hover)',
        },
        accent: '#3b82f6',
        'accent-dim': '#1e40af',
        muted: '#6b7280',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
