import config from '@repo/eslint-config-react';

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
