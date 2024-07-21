module.exports = {
    extends: ['@repo/eslint-config/jest', '@repo/eslint-config'],
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
};
