import globals from 'globals';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  globalIgnores(['node_modules', 'assets', 'projects/client/public/index.js']),
  js.configs.recommended,
  eslintPluginPrettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    extends: [eslintConfigPrettier],
    rules: {
      'arrow-body-style': ['warn', 'as-needed'],
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
      semi: 'error',
      'semi-spacing': 'error',
      eqeqeq: 'warn',
      'object-shorthand': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]);
