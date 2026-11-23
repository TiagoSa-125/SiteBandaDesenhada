import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => o build funciona em qualquer subpasta / alojamento estático
export default defineConfig({
  base: './',
  plugins: [react()],
})
