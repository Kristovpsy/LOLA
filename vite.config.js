import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three'
          if (id.includes('@react-three/rapier') || id.includes('@dimforge')) return 'vendor-rapier'
          if (id.includes('@react-three')) return 'vendor-r3f'
          if (id.includes('gsap')) return 'vendor-gsap'
          if (id.includes('@supabase')) return 'vendor-supabase'
        }
      }
    }
  }
})
