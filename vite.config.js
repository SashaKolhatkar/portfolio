import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Local dev serves from "/". CI sets VITE_BASE=/portfolio/ for GitHub Pages.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
})
