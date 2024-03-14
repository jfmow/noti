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
      },
      fontFamily: {
        'inter': ['Inter'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...
  ],
}

