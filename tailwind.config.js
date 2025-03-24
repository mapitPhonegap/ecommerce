module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,vue}", // adjust based on where your files are located
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  corePlugins: {
    animation: false, // Disable Tailwind animations globally
  },
  daisyui: {
    themes: [ "light", "dark", "cupcake", "bumblebee", "emerald",
      "corporate", "synthwave", "retro", "cyberpunk",
      "valentine", "halloween", "garden", "forest",
      "aqua", "lofi", "pastel", "fantasy", "wireframe",
      "black", "luxury", "dracula", "cmyk", "autumn",
      "business", "acid", "lemonade", "night", "coffee",
      "winter"],
  },
}