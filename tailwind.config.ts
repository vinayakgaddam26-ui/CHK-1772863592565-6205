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
          900: "#090A0F",
          800: "#13151A",
          700: "#1E222B",
          primary: "#00E5FF", // Neon Cyan
          alert: "#FF2A5F",   // Neon Pink/Red
          warn: "#FFC200",    // Neon Amber
          success: "#00F98A"  // Neon Green
        }
      },
    },
  },
  plugins: [],
};
