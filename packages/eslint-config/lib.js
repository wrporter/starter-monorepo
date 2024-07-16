/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    overrides: [
        {
            // Specifying overrides allows us to provide default file extensions.
            // See https://github.com/eslint/eslint/issues/2274
            files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
            rules: {
                'jsdoc/require-jsdoc': ['error', { publicOnly: true, enableFixer: false }],
            },
        },
    ],
};
