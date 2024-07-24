# @repo/eslint-config-react

This project maintains base ESLint configuration for TypeScript React projects. Each file may be extended and custom configuration may be added. We use the opinionated [Airbnb Style Guide](https://github.com/airbnb/javascript) to gain some of the best support out there.

## Installation

```shell
npm install --save-dev @repo/eslint-config-react eslint
```

## Usage

1. In your `.eslintrc.cjs` (or alternative config entry), extend the config files that suit your project. For example:
   ```javascript
   module.exports = {
     extends: ['@repo/eslint-config/jest-testing-library', '@repo/eslint-config'],
   };
   ```
2. In your `tsconfig.json`, include all TypeScript and JavaScript files via the following, including dot files, such as `.eslintrc.cjs`.
   ```json
   {
     "include": ["**/*", ".*"]
   }
   ```
   - Be sure to also `exclude` any files from your `tsconfig` now that it is being used for both linting and transpiling.
   - To get the full capabilities of linting with TypeScript, the parser must use the transpiler. If you would like to use a different `tsconfig` for linting, you can specify a new one via `tsconfig.eslint.json` then add the following to your `.eslintrc.cjs` file.
     ```javascript
     parserOptions: {
       project: './tsconfig.eslint.json';
     }
     ```
3. In your `package.json` add the following scripts.
   ```json
   {
     "scripts": {
       "lint": "eslint --cache --cache-location ./node_modules/.cache/eslint .",
       "lint:fix": "npm run lint -- --fix"
     }
   }
   ```
4. Now test out linting via `npm run lint` and fixable issues with `npm run lint:fix`.

## API

Below are each of the configuration files available and their explanations. Each config is composable and can be included with the other configs. Extend any configs that fit your project.

- [`index.js`](./index.js): Base config for all TypeScript projects.
- [`jest-testing-library.js`](./jest-testing-library.js): Config for a project using [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/) (because it currently has such a similar API to Jest) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Best Practices

- Extend the default config last (`index.js`), as it will override some undesirable rules provided by other configs.

## FAQ

- Why do I get the error `Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.`?

The full error will look like the following:

```
  0:0  error  Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.
The file does not match your project config: <insert-file-name>.
The file must be included in at least one of the projects provided
```

This happens when a file should be included in linting when the TypeScript `tsconfig.json` is not including it. ESLint requires it to be included for TypeScript projects. This is why we recommend including all files in your `tsconfig.json`. For example, `{ "include": ["**/*", ".*"] }`. This allows the entire project to adhere to the same linting and formatting rules.
