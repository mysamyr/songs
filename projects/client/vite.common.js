import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: 'src/index.js',
        styles: 'public/styles.css',
      },
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'styles.min.css',
      },
    },
  },
});
