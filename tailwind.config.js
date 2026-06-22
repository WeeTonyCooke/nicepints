/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm-black design system (1.0)
        np: {
          black: '#0A0A0A',
          cream: '#F2E9D8',
          gold:  '#C8A24B',
        },
        stout:    "#13110F",
        graphite: "#1E1B17",
        elevated: "#252119",
        line:     "#332D24",
        cream:    "#F3EFE6",
        muted:    "#8C8579",
        gold:     {
          DEFAULT: "#C8A24B",
          soft:    "#3A301A",
        },
        rating: {
          gold:   '#D8B33F',
          amber:  '#C98A2E',
          copper: '#A55A32',
          stone:  '#D8D0BE',
        },
        sage: {
          DEFAULT: "#7A9B76",
          tint:    "#1C241B",
        },
        rust: {
          DEFAULT: "#B8634A",
          tint:    "#241A16",
        },
        drink: {
          guinness:      '#F3EFE6',
          'guinness-00': '#6B8FA8',
          beamish:       '#B85C5C',
          murphys:       '#8F4A62',
          other:         '#8C8579',
        },
        ember:    "#B8634A",
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        ui:      ['Inter', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
