/** @type {import("prettier").Config} */
export default {
    printWidth: 120,
    trailingComma: 'all',
    singleQuote: true,
    tabWidth: 4,
    overrides: [
        {
            files: [
                '*.json*',
                '*.yml',
                '*.yaml',
                '*.md', // Until Prettier resolves spaces with Markdown. See https://github.com/prettier/prettier/issues/5019
            ],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
