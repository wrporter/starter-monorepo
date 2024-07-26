# Title

Author: Wesley Porter

Date: 2024-07-24

Status: proposed

## Context

Validating changes both locally and in CI can be time-consuming. Timely feedback is critical to maintaining a high
development velocity. There are several areas where performance improvements can make a considerable difference:

1. Turborepo cache
2. Docker
   1. Docker ignore file
   2. Multi-stage builds with layer caching
   3. Prune unnecessary files and dependencies
3. GitHub Action cache
4. Build only what has changed

## Decision

### Turborepo cache

Use the GitHub Action cache to store the turborepo cache so we don't have to maintain a Vercel account.

### GitHub Action Workflow

Only build new Docker images for apps that have changes. This reduces time in building, deploying, and validating apps that have not been changed.

1. Builds are about 40 seconds faster without using the GitHub Actions cache for the docker images.
2. Builds are about 2 minutes faster without building the base image in a separate job to be shared across all apps. This is done by uploading the tar of the built image, then in the next job, downloading the tar and pushing it to a locally running registry. The other jobs then reference it. See https://docs.docker.com/build/ci/github-actions/share-image-jobs/ for more info.

### Docker

1. Ignore everything by default in the `.dockerignore` file, then allowlist the necessary files and directories. This ensures less data is sent to the Docker daemon and the build context is smaller.
2. A base Dockerfile is used to maintain common parts of the apps. Each app requires a `dockerfileType` in the `package.json` corresponding to the Dockerfile to use. For example, `"dockerfileType": "node"` will use `node.Dockerfile` in the app's directory. This is to avoid a separate configuration file and allows us to use the same Dockerfile for similar apps.
3. Use multi-stage builds with layer caching to reduce the time it takes to build the Docker image. The process is as follows:
   1. Copy the `package.json` and `package-lock.json`, remove scripts and other fields that are not necessary for installing dependencies. This will allow the Docker cache to be used when the dependencies have not changed.
   2. Install dependencies, copy the remaining files, and build all apps and packages.
   3. Prune all dev dependencies.
   4. Use `turbo prune --scope={app} --docker` to remove all unnecessary files (e.g. other apps, unused packages, etc.) for a specific app image.
   5. Create a production image and copy over only necessary files.

## Consequences

Some aspects of the build process can be more complex, but the time saved in CI and local development will be worth it. For example:

- The Docker ignore file will need to be maintained as new files are added to the project. This can also be a benefit because if new required files are added, the CI build will likely fail. We are then intentional about what files are added rather than files creeping in when they are not needed.
- Additional steps in the GitHub Actions workflow are needed to maintain caching and build only what has changed.
- Detecting which apps changed can be complex. Files changed in an app's directory are not the only indicators for the need to rebuild. For example, if a Dockerfile changed, then all apps using that Dockerfile should be rebuilt.
