# TODO

- [ ]: Instructions to publish to a private npm registry. Can/should we consider publishing straight to GitHub instead?
- [ ]: Build only apps and packages that have changed.
- [ ]: Be able to easily extract an app/package into its own repository.
- [ ]: A single entrypoint to build all packages and apps, publish changed packages, and deploy changed apps.
- [ ]: Consider splitting dockerfiles for different app types. This has already been done for test-e2e and can also be done for test-api because they depend on more files and have a different start command. One way to achieve this is with multiple Dockerfiles in the same directory by type (e.g. app.Dockerfile, test-api.Dockerfile, test-e2e.Dockerfile). Also consider using turborepo with npm scripts in each app that know how to build their own docker image (e.g. `npx turbo run docker:build --scope=test-e2e` would only run the npm script in the test-e2e app).
- [ ]: Determine a consistent way to build and execute each app. When transpiling TypeScript apps, by default they are compiled to CommonJS. We can compile to ESM by setting `"module": "ESNext"` in `tsconfig.json`. However, when doing this, we must also import with file extensions (e.g. `import './module.js'` versus `import './module'`. Is it just better to include explicit file extensions in all imports?

# starter-monorepo

**NOTE: This starter project is incomplete and not ready for use!**

This is a monorepo starter for multiple services and packages. Public packages are intended to be published, such as types or clients/SDKs.

## Getting Started

1. Install dependencies:
   ```shell
   npm install
   ```
2. Run in development mode:
   ```shell
   npm run dev
   ```
3. Visit http://localhost:3001

## Unit Tests

Run unit tests for all workspaces:

```shell
npm run test
```

Run unit tests and record coverage for the main project:

```shell
npm run test:coverage -w=main
```

## API Tests

API tests are a lower-cost replacement for integration tests. They are essentially E2E tests for API routes. For any new route use case, you should write a new API test to validate the results. These tests are intended to run in every data center just after a deployment to validate that the deployment was successful.

1. Run the main app (see [Getting Started](#getting-started))
2. Run the tests against your local machine
   ```shell
   npm run test:local -w=api-tests
   ```
   
## Docker

You can build and validate individual containers via `.ci/build.sh backend` and `.ci/run.sh app backend`.

Run tests via `.ci/build.sh test-api` and `.ci/run.sh test test-api`.

Spin up the full environment with `docker-compose up`. Include the `--build` flag to rebuild the images. This will first start the database, run migrations, start the backend then the frontend, and finally run API and E2E tests.

## CI Pipeline

TODO

[act](https://nektosact.com/) is an incredibly useful tool for testing out GitHib Actions workflows locally.
