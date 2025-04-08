import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({

  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://talentid-backend-v2.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  }
});


