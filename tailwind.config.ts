/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        carbon: {
          900: "#000000",
          800: "#111111",
          700: "#222222",
          primary: "#FF0000", // sharp red highlight
          alert: "#FF0000",
          warn: "#FF0000",
          success: "#FF0000"
        }
      },
    },
  },
  plugins: [],
};
