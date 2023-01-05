import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  root: 'src',
  server: {
    port: 3000,
  },
  build: {
    // Relative to the root
    // outDir: './dist',
    rollupOptions: {
      input: ['src/client/index.jsx'],
    },
  },
  plugins: [
    viteCommonjs(),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
})
