#!/usr/bin/env bash

# Builds all the apps and packages in the workspace. Publishes public packages
# to npm. Copies the built assets to a fresh layer, which is then used by the
# separate app Dockerfiles.

set -e
source .ci/config.sh

buildDocker \
  --file .ci/base.Dockerfile \
  --tag "${BASE_TAG}" \
  .
