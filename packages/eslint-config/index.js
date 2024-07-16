const baseRules = require('./rules/base');

/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    ignorePatterns: ['dist', '**/build', 'coverage', '**/*.generated.*'],
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
    },
    env: {
        es2021: true,
        node: true,
    },
    extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:jsdoc/recommended'],
    plugins: ['node', 'import', 'unused-imports', 'jsdoc'],
    settings: {
        'import/resolver': {
            typescript: {},
            node: {
                extensions: ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.cts', '.mts', '.tsx', '.d.ts'],
            },
        },
    },
    overrides: [
        {
            // Specifying overrides allows us to provide default file extensions.
            // See https://github.com/eslint/eslint/issues/2274
            files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
            rules: {
                ...baseRules,
            },
        },
        {
            // allow for CommonJS files to use require
            files: '**/*.{js,cjs}',
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
        {
            // allow config files to use default exports
            files: '**/*.{config,generated}.{js,mjs,ts,mts}',
            rules: {
                'import/no-default-export': 'off',
            },
        },
    ],
};
