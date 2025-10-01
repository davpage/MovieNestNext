/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    // tailwind.config.js (փաստացի extend բլոկի ներսում ավելացրու)
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          400: '#22d3ee', // cyan
          500: '#06b6d4',
          600: '#0891b2',
        },
        flame: {
          400: '#fb7185', // rose
          500: '#f43f5e',
        },
      },
      backgroundImage: {
        'radial-faint': 'radial-gradient(1000px 600px at 10% -10%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(800px 500px at 120% 10%, rgba(34,211,238,0.25), transparent 60%)',
        'radial-strong': 'radial-gradient(600px 400px at 20% 0%, rgba(244,63,94,0.25), transparent 60%), radial-gradient(600px 400px at 80% 0%, rgba(99,102,241,0.25), transparent 60%)',
        'gloss': 'linear-gradient(to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
        'border-gradient': 'linear-gradient(135deg, rgba(99,102,241,.6), rgba(34,211,238,.6))',
        'btn-gradient': 'linear-gradient(135deg, #6366f1, #06b6d4)',
        'btn-gradient-dark': 'linear-gradient(135deg, #22d3ee, #f43f5e)',
      },
      boxShadow: {
        'soft': '0 10px 30px -12px rgba(0,0,0,0.3)',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    }

  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
  ],
}
