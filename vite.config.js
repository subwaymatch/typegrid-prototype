import { defineConfig } from 'vite'

// Relative base so the build works at a domain root or under a sub-path.
export default defineConfig({
  base: './',
  build: { assetsInlineLimit: 0 },
})
