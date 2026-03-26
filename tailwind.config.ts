import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gallery: {
          50: "#faf9f7",
          100: "#f5f3ef",
          200: "#e8e4dc",
          300: "#d4cec2",
          400: "#b5ac9a",
          500: "#968a74",
          600: "#7a6e5a",
          700: "#635949",
          800: "#534a3d",
          900: "#473f35",
          950: "#27221c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#534a3d",
            a: {
              color: "#7a6e5a",
              "&:hover": {
                color: "#473f35",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
