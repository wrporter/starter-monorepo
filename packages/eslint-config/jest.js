/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    extends: ['plugin:jest/recommended'],
    plugins: ['jest'],
    settings: {
        jest: {
            version: 28,
        },
    },
    env: {
        jest: true,
        'jest/globals': true,
    },
    overrides: [
        {
            files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],
            rules: {
                'jest/expect-expect': [
                    'error',
                    {
                        // allow for custom expect functions
                        assertFunctionNames: ['expect*'],
                    },
                ],
                // allow for .any() matchers in tests
                '@typescript-eslint/no-unsafe-assignment': 'off',
            },
        },
    ],
};
