/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    plugins: ['jest-dom', 'testing-library'],
    overrides: [
        {
            files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],
            extends: [
                '@repo/eslint-config/jest',
                'plugin:jest-dom/recommended',
                'plugin:testing-library/react',
            ],
        },
    ],
};
