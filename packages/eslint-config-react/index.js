import config from '@repo/eslint-config';
import pluginJestDom from 'eslint-plugin-jest-dom';
// TODO: Add once jsx-a11y supports eslint 9 / flat configs
// import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginTestingLibrary from 'eslint-plugin-testing-library';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  pluginReact.configs.flat.recommended,
  pluginJestDom.configs['flat/recommended'],

  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'testing-library': pluginTestingLibrary,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
];
