module.exports = {
    extends: ['@repo/eslint-config/jest', '@repo/eslint-config'],
    rules: {
        // Disable for Effect error _tag property.
        'no-underscore-dangle': 'off',
    },
};
