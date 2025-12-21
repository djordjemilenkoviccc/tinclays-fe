import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'  // Allow access inside Docker
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'bootstrap-vendor': ['react-bootstrap', 'bootstrap'],
          'animation-vendor': ['framer-motion'],
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable minification (using esbuild, which is faster and built-in)
    minify: 'esbuild'
  }
})
