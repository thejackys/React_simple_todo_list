import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      // input: '/path/to/main.js',
      output: {
        // overwrite default .html output
        // entryFileNames: 'main.js',
        // chunkFileNames: 'chunks/[name]-[hash].js',
        // assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
  },
})
