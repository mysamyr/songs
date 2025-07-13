import { mergeConfig } from 'vite';
import commonConfig from './vite.common.js';

export default mergeConfig(commonConfig, {
  build: {
    minify: false,
    sourcemap: true,
  },
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
});
