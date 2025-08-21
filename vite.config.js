import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Project root is the current directory
  build: {
    outDir: 'dist', // Output directory for production build
    emptyOutDir: true, // Empty the output directory on build
  },
  server: {
    port: 3001, // Vite dev server port
    open: true, // Open browser automatically
  },
  // Resolve aliases if needed, e.g., for /src paths
  resolve: {
    alias: {
      '/src': './src',
    },
  },
});