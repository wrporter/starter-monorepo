import config from '@wesp-up/eslint-config';

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
