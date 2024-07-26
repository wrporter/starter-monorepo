# @repo/eslint-config

This project maintains base ESLint configuration for TypeScript projects. Each file may be extended and custom configuration may be added. We use the recommended rules as much as possible to gain great default support.

For ultimate productivity, configure your IDE to auto-lint when saving changes.

## Installation

```shell
npm install --save-dev @repo/eslint-config eslint
```

## Usage

1. In your `eslint.config.js` (or alternative config entry), extend the config files that suit your project. For example:

   ```javascript
   import config from '@repo/eslint-config';

   export default [...config];
   ```

2. In your `tsconfig.json`, include all TypeScript and JavaScript files via the following, including dot files.

   ```json
   {
     "include": ["**/*", ".*"]
   }
   ```

   - Be sure to also `exclude` any files from your `tsconfig` now that it is being used for both linting and transpiling.
   - To get the full capabilities of linting with TypeScript, the parser must use the transpiler. If you would like to use a different `tsconfig` for linting, you can specify a new one via `tsconfig.eslint.json` then add the following to your `eslint.config.js` file.

     ```json
     {
       "extends": "./tsconfig.json",
       "include": ["**/*", ".*"]
     }
     ```

     ```javascript
     // eslint.config.js
     import config from '@repo/eslint-config';

     export default [
       ...config,
       {
         languageOptions: {
           parserOptions: {
             project: './tsconfig.eslint.json',
           },
         },
       },
     ];
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
- [`lib.js`](./lib.js): Config for a shared library meant to be installed in other projects.

## FAQ

- Why do I get the error `Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.`?

The full error will look like the following:

```
  0:0  error  Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.
The file does not match your project config: <insert-file-name>.
The file must be included in at least one of the projects provided
```

This happens when a file should be included in linting when the TypeScript `tsconfig.json` is not including it. ESLint requires it to be included for TypeScript projects. This is why we recommend including all files in your `tsconfig.json`. For example, `{ "include": ["**/*", ".*"] }`. This allows the entire project to adhere to the same linting and formatting rules.

- I'm using `supertest`, why do I get the ESLint error `vitest/expect-expect`?

This is because there are no assertions in the Vitest format. The way `supertest` performs its assertions is not always readable. Rather than doing this:

```typescript
import request from 'supertest';

await request(app).get('/route').expect(200);
```

Prefer to explicitly pull out the fields and use regular assertions:

```typescript
import request from 'supertest';

const { status, body } = await request(app).get('/route');

expect(status).toBe(200);
expect(body).toEqual('some plain text');
```
