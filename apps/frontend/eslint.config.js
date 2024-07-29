import config from '@wesp-up/eslint-config-react';

export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
];
