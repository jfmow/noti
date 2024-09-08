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
        "slidein": "slideout 0.5s ease forwards",
        "slideout": "slidein 0.5s ease forwards",
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
          "0%": { "filter": "blur(0px)" },
          "99%": { display: "none", "filter": "blur(3px)", marginRight: "-260px" },
          "100%": { display: "none", "filter": "blur(3px)", marginRight: "-260px", overflow: "hidden" }
        },
        slidein: {
          "0%": { marginRight: "-260px", "filter": "blur(3px)" },
          "100%": { marginRight: "0px", display: "flex", "filter": "blur(0px)" }
        }
      },
      fontFamily: {
        'inter': ['Inter'],
        sans: ['Inter', 'sans-serif'],
        beba: ["Bebas Neue", 'sans-serif'],
      },
      colors: {
        'hometext': '#03151e',
        'homebackground': '#f4fbfe',
        'homeprimary': '#26b6e7',
        'homesecondary': '#a178f0',
        'homeaccent': '#a54ceb',
      },
      fontSize: {
        input: '14px',
      }

    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

