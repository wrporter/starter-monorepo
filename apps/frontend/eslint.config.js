import config from '@wesp-up/eslint-config-react';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/*.{test,config,build,fake,mock,seed}.*'] },
      ],
    },
    ignores: ['.react-router/**/*'],
  },
  {
    files: ['**/*.{test,fake,mock,seed}.*', '**/*.{js,cjs,mjs,jsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
];
