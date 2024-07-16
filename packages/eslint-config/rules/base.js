module.exports = {
    // Imports
    'import/extensions': [
        'error',
        'ignorePackages',
        {
            js: 'never',
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            mts: 'never',
            tsx: 'never',
        },
    ],
    'import/no-extraneous-dependencies': [
        'error',
        {
            devDependencies: ['**/*.{test,config,build}.*'],
        },
    ],
    'import/order': [
        'error',
        {
            groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
            'newlines-between': 'always',
            alphabetize: {
                order: 'asc',
                caseInsensitive: true,
            },
        },
    ],
    'sort-imports': [
        'error',
        {
            ignoreCase: false,
            ignoreDeclarationSort: true, // use eslint-plugin-import for this instead
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            allowSeparatedGroups: true,
        },
    ],
    'unused-imports/no-unused-imports': 'error',

    // Prefer named exports
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',

    // TypeScript
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
        'error',
        {
            args: 'none',
            ignoreRestSiblings: true,
        },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
        'error',
        {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true,
        },
    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',

    // Disable rules
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'no-restricted-exports': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/quotes': 'off',

    // JSDoc
    // Do not require by default, only in libraries
    'jsdoc/require-jsdoc': 'off',
    // Ignore types because we infer this from TypeScript
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-property-type': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
};
