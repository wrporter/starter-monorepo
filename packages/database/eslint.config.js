import config from '@wesp-up/eslint-config';
import configLib from '@wesp-up/eslint-config/lib';

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
