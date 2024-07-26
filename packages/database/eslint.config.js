import config from '@repo/eslint-config';
import configLib from '@repo/eslint-config/lib';

export default [
  ...config,
  ...configLib,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
];
