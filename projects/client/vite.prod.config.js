import { mergeConfig } from 'vite';
import commonConfig from './vite.common.js';

export default mergeConfig(commonConfig, {
  build: {
    minify: 'esbuild',
    sourcemap: false,
  },
});
