/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./customEditorTools/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-quick': 'fadeinquick 0.3s 1 ease',
        'fade-in-slow-middle': 'fadeinslowmiddle 0.3s 1 ease',
        "background-shine": "background-shine 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-in",
        "slidein": "slideout 0.3s ease-in-out forwards",
        "slideout": "slidein 0.3s ease-in-out forwards",
      },
      keyframes: {
        fadeinquick: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeinslowmiddle: {
          '0%': { opacity: 0, transformOrigin: "center", transform: "scale(0.8)" },
          '100%': { opacity: 1, transformOrigin: "center", transform: "scale(1)" },
        },
        "background-shine": {
          "from": {
            "backgroundPosition": "0 0"
          },
          "to": {
            "backgroundPosition": "-200% 0"
          }
        },
        "fade-in": {
          "0%": {
            "opacity": "0"
          },
          "100%": {
            "opacity": "1"
          }
        },
        slideout: {
          "0%": { transform: "translateX(0px)", "margin-right": "0px", "filter": "blur(0px)" },
          "100%": { transform: "translateX(-260px)", "margin-right": "-260px", display: "none", "filter": "blur(3px)" }
        },
        slidein: {
          "0%": { transform: "translateX(-260px)", "margin-right": "-260px", "filter": "blur(3px)" },
          "100%": { transform: "translateX(0px)", "margin-right": "0px", display: "flex", "filter": "blur(0px)" }
        }
      },
      fontFamily: {
        'inter': ['Inter'],
        sans: ['Inter', 'sans-serif'],
        beba: ["Bebas Neue", 'sans-serif'],
      },
      colors: {
        'hometext': '#1b0225',
        'homebackground': '#f9edfe',
        'homeprimary': '#b410f5',
        'homesecondary': '#f96e96',
        'homeaccent': '#f73e44',
      },

    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

