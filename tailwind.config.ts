import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'empire-gold': '#e9b10b',
        'empire-gold-dark': '#c39714',
        'empire-bg': '#101014',
        'empire-bg-light': '#1a1a1f',
        'empire-bg-lighter': '#25252a',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-delay-1': 'fade-in 0.5s ease-out 0.3s forwards',
        'fade-in-delay-2': 'fade-in 0.5s ease-out 0.6s forwards',
        'fade-in-delay-3': 'fade-in 0.5s ease-out 0.9s forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
