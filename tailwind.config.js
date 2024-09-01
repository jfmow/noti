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
        "slidein": "slideout 0.8s ease-in-out forwards",
        "slideout": "slidein 0.8s ease-in-out forwards",
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
          "0%": { transform: "translateY(0px)", "filter": "blur(0px)" },
          "100%": { transform: "translateY(-100dvh)", display: "none", "filter": "blur(3px)" }
        },
        slidein: {
          "0%": { transform: "translateY(-100dvh)", "filter": "blur(3px)" },
          "100%": { transform: "translateY(0px)", display: "flex", "filter": "blur(0px)" }
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

