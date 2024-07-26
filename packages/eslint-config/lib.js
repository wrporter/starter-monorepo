/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': ['error', { publicOnly: true, enableFixer: false }],
    },
  },
];
