import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./ciff_impact_porta/",
  plugins: [react()],
  server: {
    fs: {
      allow: ['..',]
    }
  }
})
