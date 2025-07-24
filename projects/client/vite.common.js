import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: 'src/index.js',
        styles: 'src/styles.css',
      },
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'styles.css',
      },
    },
  },
});
