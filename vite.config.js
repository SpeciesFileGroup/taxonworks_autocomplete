// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'TWAutocomplete',
      fileName: (format) => `tw-autocomplete.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        exports: 'named'
      }
    },
  }
})