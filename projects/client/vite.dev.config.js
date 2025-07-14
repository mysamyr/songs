import { mergeConfig } from 'vite';
import commonConfig from './vite.common.js';

export default mergeConfig(commonConfig, {
  build: {
    minify: false,
    sourcemap: true,
    watch: {
      include: ['src/**/*', 'public/**/*'],
    },
  },
});
