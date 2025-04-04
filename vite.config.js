import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reext from './node_modules/@sencha/reext/dist/ReExt/vite-plugin-reext.js'

export default defineConfig({
  plugins: [
    react(), 
    reext()
  ]
})
