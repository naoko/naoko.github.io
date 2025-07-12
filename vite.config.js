import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  build: {
    outDir: 'assets/dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'assets/js/main.js')
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});