#!/usr/bin/env bash

set -e
source .github/docker/config.sh

dockerBuild \
  --progress=plain \
  --build-arg APP=test-api \
  --tag=starter-monorepo-test-api \
  --file=apps/test-api/.ci/Dockerfile \
  .
