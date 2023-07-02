/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {

      },
      screens: {
        sm: {max: '640px'},
        md: {min: '768px', max: '1024px'},
        lg: {min: '1024px', max: '1280px'},
        xl: {min: '1280px'},
        big: {min: '1024px'},
        small: {max: '1024px'},
      },
      rotate: {
        '30': '30deg',
        '60': '60deg',
        '135': '135deg',
        '150': '150deg',
        '270': '270deg'
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
        750: '750ms',
        800: '800ms',
        900: '900ms',
        1250: '1250ms',
        1500: '1500ms',
        1750: '1750ms',
        2000: '2000ms',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100'
      },
      scale: {
        '80': '0.8',
        '85': '0.85',
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
        '106': '1.06',
        '107': '1.07',
        '108': '1.08',
        '109': '1.09',
        '115': '1.15',
        '120': '1.2',
        '175': '1.75',
        '200': '2.0'
      },
      fontFamily: {
        'display': ['fantasy'],
        'ptsans': ['PTSans'],
        'cubano': ['Cubano', 'sans-serif'],
        'wotfard': ['Wotfard'],
        'wotfard-sb': ['WotfardSB'],
        'wotfard-md': ['WotfardMD']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
