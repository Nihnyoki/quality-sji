// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  optimizeDeps: {
    include: ['prop-types'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'prop-types': 'prop-types/index.js',
    },
  },
  assetsInclude: ['**/*.glb'],
})
