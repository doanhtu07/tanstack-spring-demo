//  @ts-check

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],

  semi: false,
  singleQuote: true,
  trailingComma: 'all',

  tailwindStylesheet: './src/styles/global.css',
}

export default config
