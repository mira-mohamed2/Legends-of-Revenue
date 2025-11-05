import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  // Use base path based on mode:
  // - 'expo' mode: Use '/' for local expo builds
  // - production build: Use '/Legends-of-Revenue/' for GitHub Pages
  // - dev mode: Use '/' for development
  base: mode === 'expo' ? '/' : (command === 'build' ? '/Legends-of-Revenue/' : '/'),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
}))
