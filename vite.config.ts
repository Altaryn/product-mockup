import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mockup only — no backend, no proxy. Static SPA.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
})
