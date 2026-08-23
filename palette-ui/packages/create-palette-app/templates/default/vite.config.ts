__PATH_IMPORT__
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
__PALETTE_ALIAS_SETUP__

export default defineConfig({
  plugins: [react()],
__RESOLVE_BLOCK__
  server: {
    port: __PORT__,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
