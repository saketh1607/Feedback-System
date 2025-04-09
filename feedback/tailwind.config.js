// tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2563eb',
            dark: '#1d4ed8',
          },
          secondary: {
            DEFAULT: '#4f46e5',
            dark: '#4338ca',
          },
        },
        boxShadow: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };