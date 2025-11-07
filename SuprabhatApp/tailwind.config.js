

/** @type {import('tailwindcss').Config} */
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Example: include your components folder
      ],
      presets: [require("nativewind/preset")],
      theme: {
        extend: {},
      },
      plugins: [],
    };