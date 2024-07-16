const reactRules = require('./rules/react');

/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    extends: ['airbnb', 'airbnb-typescript', '@repo/eslint-config'],
    env: {
        browser: true,
    },
    overrides: [
        {
            // Specifying overrides allows us to provide default file extensions.
            // See https://github.com/eslint/eslint/issues/2274
            files: ['**/*.{jsx,tsx}'],
            rules: {
                ...reactRules,
            },
        },
    ],
};
