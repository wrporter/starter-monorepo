# TODO

- [ ]: Instructions to publish to a private npm registry. Can/should we consider publishing straight to GitHub instead?
- [ ]: Build only apps and packages that have changed.
- [ ]: Be able to easily extract an app/package into its own repository.
- [ ]: A single entrypoint to build all packages and apps, publish changed packages, and deploy changed apps.
- [ ]: Frontend
   - [ ]: MUI breaks the dev server

# starter-monorepo

**NOTE: This starter project is incomplete and not ready for use!**

This is a monorepo starter for a service. The difference between this starter and the non-monorepo ones is that it allows for publishing packages associated with a project, such as types or clients/SDKs. This starter is not intended to contain multiple services and should be scoped to a single service. This allows for simplified ownership transfer of specific domain areas.

## Getting Started

1. Install dependencies:
   ```shell
   npm install
   ```
2. Run in development mode:
   ```shell
   npm run dev
   ```
3. Visit http://localhost:3000

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

## CI Pipeline

**NOTE: This section is a work in progress and we hope to abstract shell scripts and dockerfiles out so they do not have to be copy-pasted.**

1. Build the base image and all workspaces: `.ci/entrypoint-build.sh`
2. Publish Docker images and npm packages: `.ci/entrypoint-publish.sh`
3. Test out the Docker images locally
   - Run the main app: `.ci/run-local-main.sh`
   - Validate via API tests: `.ci/run-local-api-tests.sh`
4. Publish TRS results
   - For the main app: `.ci/report-trs.sh` (includes coverage)
   - For API tests: `.ci/report-trs-api-tests.sh`
5. After deployment, push a production image for tests: `.ci/entrypoint-post-deploy.sh`
