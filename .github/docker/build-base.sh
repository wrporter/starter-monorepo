#!/usr/bin/env bash

# TODO: Consider removing in favor of only using docker-compose and GitHub Actions.
#       Make sure to also remove the docker:build script in each package.json file.
# Builds all the apps and packages in the workspace. Publishes public packages
# to npm. Copies the built assets to a fresh layer, which is then used by the
# separate app Dockerfiles.

set -e
source .github/docker/config.sh

buildDocker \
  --file .github/docker/base.Dockerfile \
  --tag "${BASE_TAG}" \
  .
