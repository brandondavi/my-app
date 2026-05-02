import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://backend-my-app-t8vb.onrender.com:10000',
        changeOrigin: true,
      },
    },
  },
})