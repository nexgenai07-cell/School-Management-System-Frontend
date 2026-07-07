import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://schoolassistant-neon.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})