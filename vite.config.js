import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

import config from './vite.json'

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  server: {
    https: true,
    port: config.port,
    open: config.brandingPath + '/',
    proxy: {
      [config.brandingPath]: {
        target: config.infinityUrl,
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: config.infinityUrl,
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    mkcert()
  ]
})
