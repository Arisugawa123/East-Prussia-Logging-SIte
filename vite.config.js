import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure we're not using platform-specific binaries
      external: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-linux-musl-x64'],
    },
    // Use esbuild for faster builds
    target: 'es2020',
    minify: 'esbuild',
  },
  // Ensure Vite uses the correct environment variables
  define: {
    'process.env': {}
  },
  // Set the base URL for production
  base: '/',
  // Configure the development server
  server: {
    port: 3000,
    open: true
  },
  // Configure the preview server
  preview: {
    port: 3000,
    open: true
  }
});
