import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reext from './plugins/vite-plugin-reext';

export default defineConfig({
  plugins: [
    react(), 
    reext()
  ],
  build: {
    outDir: 'dist',
    target: 'esnext',  // Or set based on your compatibility needs
  }
})
