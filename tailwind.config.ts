import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040e17",
          900: "var(--primary-navy, #071B2B)", // Primary Navy from design reference / live theme
          800: "var(--secondary-navy, #102B3D)", // Secondary Navy
          700: "#183B54",
        },
        emerald: {
          brand: "var(--emerald-brand, #008F5A)", // Primary Brand Color from design / live theme
          hover: "var(--emerald-hover, #007A4D)",
          deep: "var(--deep-green, #006B45)",
          light: "var(--emerald-light, #E8F5F0)",
        },
        softBg: "#F5F7F6",
        editorialBorder: "#E4E9E7",
        editorialText: {
          primary: "#14202A",
          secondary: "#66717A",
          muted: "#8A96A0",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
